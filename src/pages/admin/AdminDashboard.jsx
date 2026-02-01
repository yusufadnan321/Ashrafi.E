import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline"

import { updateDocument, addDocument, deleteDocument } from "../../hooks/useFirebaseWrite"
import { uploadAboutData } from "../../utils/uploadAboutData"
import ImageUpload from "../../components/ImageUpload"
import { deleteFromCloudinary } from "../../utils/cloudinaryUpload"

import { useFirebaseData } from '../../hooks/useFirebaseData';
import useSiteSettings from '../../hooks/useSiteSettings';
import useDashboardStats from '../../hooks/useDashboardStats';
const AdminDashboard = () => {
  const { data: dbProducts, loading: productsLoading } = useFirebaseData('products');
  const { data: dbProjects, loading: projectsLoading } = useFirebaseData('projects');
  const { data: dbEmployees, loading: employeesLoading } = useFirebaseData('employees');
  const { data: dbAboutContent, loading: aboutLoading } = useFirebaseData('aboutContent');
  const { data: dbMessages, loading: messagesLoading } = useFirebaseData('messages');
  const { settings: siteSettings, updateSettings, loading: settingsLoading } = useSiteSettings();
  const { stats: dashboardStats, updateSingleStat, loading: statsLoading } = useDashboardStats();

  const [editingSiteSettings, setEditingSiteSettings] = useState(null);



  const [activeTab, setActiveTab] = useState("overview")
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [editingAboutItem, setEditingAboutItem] = useState(null)

  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [isAddingAboutItem, setIsAddingAboutItem] = useState(false)
  const [aboutFilterType, setAboutFilterType] = useState("all")

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    salary: 0,
    email: "",
    status: "Active",
    attendanceDays: 0,
    totalTrackedDays: 0,
    attendanceHistory: [],
  })

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    sales: 0,
    image: "",
    category: "Shutters",
    rating: 5,
    inStock: true,
    originalPrice: 0,
    features: [],
  })

  const [newProject, setNewProject] = useState({
    title: "",
    client: "",
    budget: 0,
    progress: 0,
    status: "In Progress",
    category: "Shutters",
    description: "",
    duration: "",
    date: "",
    image: "",
  })

  const [newAboutItem, setNewAboutItem] = useState({
    section: "hero",
    content: {},
  })

  const [editingStats, setEditingStats] = useState(null)
  const [showAttendanceCalendar, setShowAttendanceCalendar] = useState(null) // stores employee ID
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())

  const [employees, setEmployees] = useState([])
  const [products, setProducts] = useState([])
  const [projects, setProjects] = useState([])
  const [aboutContent, setAboutContent] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => {
setEmployees(dbEmployees)
}, [dbEmployees])


useEffect(() => {
setProducts(dbProducts)
}, [dbProducts])


useEffect(() => {
setProjects(dbProjects)
}, [dbProjects])

useEffect(() => {
setAboutContent(dbAboutContent)
}, [dbAboutContent])

useEffect(() => {
setMessages(dbMessages)
}, [dbMessages])

  // Helper function to get attendance stats from history (month-based)
  const getAttendanceStats = (employee, month = new Date().getMonth(), year = new Date().getFullYear()) => {
    const history = Array.isArray(employee.attendanceHistory) ? employee.attendanceHistory : []
    if (history.length === 0) return { presentDays: 0, totalDays: 0 }

    const monthHistory = history.filter((record) => {
      const recordDate = new Date(record.date)
      return recordDate.getFullYear() === year && recordDate.getMonth() === month
    })

    if (monthHistory.length === 0) return { presentDays: 0, totalDays: 0 }

    const presentDays = monthHistory.filter((record) => record.present).length
    const totalDays = monthHistory.length

    return { presentDays, totalDays }
  }

  // Helper function to get current month's total days
  const getCurrentMonthDays = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  // Get all dates in specified month
  const getCurrentMonthDates = (month, year) => {
    const totalDays = new Date(year, month + 1, 0).getDate()
    const dates = []
    const today = new Date()
    
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day)
      dates.push({
        date: date.toISOString().split('T')[0],
        day: day,
        dayOfWeek: date.getDay(),
        isToday: date.toDateString() === today.toDateString()
      })
    }
    return dates
  }

  // Get attendance status for a specific date
  const getAttendanceStatus = (employee, dateStr) => {
    const history = Array.isArray(employee.attendanceHistory) ? employee.attendanceHistory : []
    const record = history.find(r => r.date === dateStr)
    if (record) {
      if (record.onLeave) return 'leave'
      return record.present ? 'present' : 'absent'
    }

    // If employee status is On Leave and no record exists, show leave for today only
    const today = new Date().toISOString().split('T')[0]
    if (employee.status === "On Leave" && dateStr === today) return 'leave'

    return null // holiday/not marked
  }

  // Toggle attendance status for a date
  const toggleAttendanceStatus = async (employeeId, dateStr) => {
    const employee = employees.find(e => e.id === employeeId)
    if (!employee) return

    const history = Array.isArray(employee.attendanceHistory) ? employee.attendanceHistory : []
    const existingRecord = history.find(r => r.date === dateStr)
    
    let newStatus
    if (!existingRecord) {
      newStatus = 'present' // First click: mark as present (green)
    } else if (existingRecord.present && !existingRecord.onLeave) {
      newStatus = 'absent' // Second click: mark as absent (red)
    } else if (!existingRecord.present && !existingRecord.onLeave) {
      newStatus = 'leave' // Third click: mark as on leave (yellow)
    } else {
      newStatus = null // Fourth click: remove (holiday)
    }

    // Update history
    let updatedHistory
    if (newStatus === null) {
      // Remove the record (holiday)
      updatedHistory = history.filter(r => r.date !== dateStr)
    } else {
      // Update or add record
      updatedHistory = history.filter(r => r.date !== dateStr)
      updatedHistory.push({
        date: dateStr,
        present: newStatus === 'present',
        onLeave: newStatus === 'leave'
      })
    }

    // Calculate stats
    const presentDays = updatedHistory.filter(r => r.present).length
    const totalDays = updatedHistory.length

    try {
      await updateDocument('employees', employeeId, {
        attendanceDays: presentDays,
        totalTrackedDays: totalDays,
        attendanceHistory: updatedHistory
      })
    } catch (error) {
      console.error('Failed to update attendance:', error)
    }
  }

  const calculateDynamicStats = () => {
    const profit = dashboardStats.totalSales - dashboardStats.totalCosts
    const profitMargin = ((profit / dashboardStats.totalSales) * 100).toFixed(1)
    const salesProgress = ((dashboardStats.totalSales / dashboardStats.monthlySaleGoal) * 100).toFixed(0)
    
    // Calculate average attendance as days ratio
    let totalPresentDays = 0
    let totalTrackedDays = 0
    
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    employees.forEach((emp) => {
      const stats = getAttendanceStats(emp, currentMonth, currentYear)
      totalPresentDays += stats.presentDays
      totalTrackedDays += stats.totalDays
    })
    
    const avgAttendanceRatio = totalTrackedDays > 0 ? (totalPresentDays / totalTrackedDays * 100) : 0
    const avgPresentDays = employees.length > 0 ? (totalPresentDays / employees.length).toFixed(1) : 0
    const avgTotalDays = employees.length > 0 ? (totalTrackedDays / employees.length).toFixed(1) : 0
    
    const productivityScore = (
      (avgAttendanceRatio + Number.parseFloat(profitMargin) + Number.parseFloat(salesProgress)) /
      3
    ).toFixed(0)

    return {
      profit,
      profitMargin,
      salesProgress,
      avgPresentDays,
      avgTotalDays,
      avgAttendanceRatio: avgAttendanceRatio.toFixed(0),
      productivityScore,
      isProfit: profit > 0,
    }
  }

    if (productsLoading || projectsLoading || employeesLoading || statsLoading) {
      return <div className="min-h-screen flex items-center justify-center text-lg">Loading dashboard data...</div>;
    }
  const dynamicStats = calculateDynamicStats()

  const stats = [
    {
      title: "Total Sales",
      value: `৳${dashboardStats.totalSales.toLocaleString()}`,
      change: `${dynamicStats.salesProgress}% of goal`,
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      color: "text-green-600",
      details: `Goal: ৳${dashboardStats.monthlySaleGoal.toLocaleString()}`,
      editable: true,
      key: "totalSales",
    },
    {
      title: "Total Costs",
      value: `৳${dashboardStats.totalCosts.toLocaleString()}`,
      change: `${dynamicStats.isProfit ? "Profit" : "Loss"}: ৳${Math.abs(dynamicStats.profit).toLocaleString()}`,
      icon: <ChartBarIcon className="h-8 w-8" />,
      color: dynamicStats.isProfit ? "text-green-600" : "text-red-600",
      details: `Margin: ${dynamicStats.profitMargin}%`,
      editable: true,
      key: "totalCosts",
    },
    {
      title: "Employees",
      value: employees.length.toString(),
      change: `Active: ${employees.filter((emp) => emp.status === "Active").length}`,
      icon: <UserGroupIcon className="h-8 w-8" />,
      color: "text-blue-600",
      details: `On Leave: ${employees.filter((emp) => emp.status === "On Leave").length}`,
      editable: false,
      key: "totalEmployees",
    },
    {
      title: "Avg Attendance",
      value: `${dynamicStats.avgPresentDays} days`,
      change: `Productivity: ${dynamicStats.productivityScore}%`,
      icon: <ClockIcon className="h-8 w-8" />,
      color: "text-purple-600",
      details: `Overall: ${dynamicStats.avgAttendanceRatio}% attendance rate`,
      editable: false,
    },
  ]

  const handleEditStat = (stat) => {
    setEditingStats({
      key: stat.key,
      value: dashboardStats[stat.key],
      title: stat.title,
    })
  }

  const handleSaveStat = async () => {
    const result = await updateSingleStat(editingStats.key, editingStats.value)
    if (result.success) {
      setEditingStats(null)
    } else {
      alert('Failed to update stat: ' + result.error)
    }
  }

  const markAttendance = async (employeeId, isPresent) => {
    const today = new Date().toISOString().split("T")[0]
    const employee = employees.find((emp) => emp.id === employeeId)
    if (!employee) return
    const history = Array.isArray(employee.attendanceHistory) ? employee.attendanceHistory : []
    
    // Update or add today's attendance
    const updatedHistory = [
      { date: today, present: isPresent },
      ...history.filter((record) => record.date !== today),
    ]

    // Calculate present days out of total tracked days
    const presentDays = updatedHistory.filter((record) => record.present).length
    const totalDays = updatedHistory.length

    try {
      await updateDocument("employees", employeeId, {
        attendanceDays: presentDays,
        totalTrackedDays: totalDays,
        attendanceHistory: updatedHistory,
      })
    } catch (error) {
      console.error("Failed to update attendance:", error)
    }
  }

  const getTodayAttendance = (employee) => {
    const today = new Date().toISOString().split("T")[0]
    const history = Array.isArray(employee.attendanceHistory) ? employee.attendanceHistory : []
    const todayRecord = history.find((record) => record.date === today)
    return todayRecord ? todayRecord.present : null
  }

  const handleEditEmployee = (employee) => {
    setEditingEmployee({ ...employee })
  }

  const handleSaveEmployee = async () => {
    if (!editingEmployee) return
    const { id, ...payload } = editingEmployee
    try {
      await updateDocument("employees", id, payload)
      setEditingEmployee(null)
    } catch (error) {
      console.error("Failed to update employee:", error)
    }
  }

  const handleAddEmployee = async () => {
    try {
      await addDocument("employees", {
        name: newEmployee.name,
        position: newEmployee.position,
        salary: Number.parseInt(newEmployee.salary) || 0,
        email: newEmployee.email,
        status: newEmployee.status,
        attendanceDays: 0,
        totalTrackedDays: 0,
        attendanceHistory: [],
      })
      setIsAddingEmployee(false)
      setNewEmployee({
        name: "",
        position: "",
        salary: 0,
        email: "",
        status: "Active",
        attendanceDays: 0,
        totalTrackedDays: 0,
        attendanceHistory: [],
      })
    } catch (error) {
      console.error("Failed to add employee:", error)
    }
  }

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Delete this employee?")) return
    try {
      await deleteDocument("employees", employeeId)
    } catch (error) {
      console.error("Failed to delete employee:", error)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product })
  }

  const handleSaveProduct = async () => {
    if (!editingProduct) return
    const { id, ...payload } = editingProduct
    try {
      const price = Number.parseInt(payload.price) || 0
      const stock = Number.parseInt(payload.stock) || 0
      const sales = Number.parseInt(payload.sales) || 0
      const originalPrice = Number.parseInt(payload.originalPrice) || price
      const rating = Number.parseFloat(payload.rating) || 5
      await updateDocument("products", id, {
        name: payload.name,
        description: payload.description,
        price,
        stock,
        sales,
        image: payload.image,
        category: payload.category || "Shutters",
        rating,
        inStock: payload.inStock ?? true,
        originalPrice,
        features: Array.isArray(payload.features) ? payload.features : [],
      })
      setEditingProduct(null)
    } catch (error) {
      console.error("Failed to update product:", error)
    }
  }

  const handleAddProduct = async () => {
    try {
      const price = Number.parseInt(newProduct.price) || 0
      const stock = Number.parseInt(newProduct.stock) || 0
      const sales = Number.parseInt(newProduct.sales) || 0
      const originalPrice = Number.parseInt(newProduct.originalPrice) || price
      const rating = Number.parseFloat(newProduct.rating) || 5
      await addDocument("products", {
        name: newProduct.name,
        description: newProduct.description,
        price,
        stock,
        sales,
        image: newProduct.image,
        category: newProduct.category || "Shutters",
        rating,
        inStock: newProduct.inStock ?? true,
        originalPrice,
        features: Array.isArray(newProduct.features) ? newProduct.features : [],
      })
      setIsAddingProduct(false)
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        sales: 0,
        image: "",
        category: "Shutters",
        rating: 5,
        inStock: true,
        originalPrice: 0,
        features: [],
      })
    } catch (error) {
      console.error("Failed to add product:", error)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product?")) return
    try {
      // Find product and delete its image from Cloudinary
      const product = products.find(p => p.id === productId);
      if (product?.image) {
        await deleteFromCloudinary(product.image);
      }
      
      await deleteDocument("products", productId)
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  const handleEditProject = (project) => {
    setEditingProject({ ...project })
  }

  const handleSaveProject = async () => {
    if (!editingProject) return
    const { id, ...payload } = editingProject
    try {
      const budget = Number.parseInt(payload.budget) || 0
      const progress = Number.parseInt(payload.progress) || 0
      await updateDocument("projects", id, {
        title: payload.title,
        description: payload.description || "",
        client: payload.client,
        budget,
        progress,
        status: payload.status,
        category: payload.category || "Shutters",
        duration: payload.duration || "",
        date: payload.date || "",
        image: payload.image || "",
      })
      setEditingProject(null)
    } catch (error) {
      console.error("Failed to update project:", error)
    }
  }

  const handleAddProject = async () => {
    try {
      const budget = Number.parseInt(newProject.budget) || 0
      const progress = Number.parseInt(newProject.progress) || 0
      await addDocument("projects", {
        title: newProject.title,
        description: newProject.description || "",
        client: newProject.client,
        budget,
        progress,
        status: newProject.status,
        category: newProject.category || "Shutters",
        duration: newProject.duration || "",
        date: newProject.date || "",
        image: newProject.image || "",
      })
      setIsAddingProject(false)
      setNewProject({
        title: "",
        client: "",
        budget: 0,
        progress: 0,
        status: "In Progress",
        category: "Shutters",
        description: "",
        duration: "",
        date: "",
        image: "",
      })
    } catch (error) {
      console.error("Failed to add project:", error)
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project?")) return
    try {
      // Find project and delete its image from Cloudinary
      const project = projects.find(p => p.id === projectId);
      if (project?.image) {
        await deleteFromCloudinary(project.image);
      }
      
      await deleteDocument("projects", projectId)
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  // About Content Handlers
  const getAboutItemBySection = (section) => {
    return aboutContent.find(item => item.section === section) || {};
  }

  const handleEditAboutSection = (section) => {
    const item = getAboutItemBySection(section);
    setEditingAboutItem({ section, content: item.content || {}, id: item.id });
  }

  const handleSaveAboutItem = async () => {
    if (!editingAboutItem) return;
    try {
      if (editingAboutItem.id) {
        await updateDocument("aboutContent", editingAboutItem.id, {
          section: editingAboutItem.section,
          content: editingAboutItem.content
        });
      } else {
        await addDocument("aboutContent", {
          section: editingAboutItem.section,
          content: editingAboutItem.content
        });
      }
      setEditingAboutItem(null);
    } catch (error) {
      console.error("Failed to save about item:", error);
    }
  }

  const handleUploadAboutData = async () => {
    if (window.confirm('This will upload initial About page data to Firebase. Continue?')) {
      const result = await uploadAboutData();
      if (result.success) {
        alert('About data uploaded successfully! Refresh the page to see the changes.');
      } else {
        alert(`Upload failed: ${result.message}`);
      }
    }
  }

  const formatCurrency = (amount) => `৳${amount.toLocaleString()}`


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Admin</span>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <nav className="space-y-2">
                {[
                  { id: "overview", name: "Overview", icon: <ChartBarIcon className="h-5 w-5" /> },
                  { id: "employees", name: "Employees", icon: <UserGroupIcon className="h-5 w-5" /> },
                  { id: "projects", name: "Projects", icon: <PencilIcon className="h-5 w-5" /> },
                  { id: "products", name: "Products", icon: <CurrencyDollarIcon className="h-5 w-5" /> },
                  { id: "about", name: "About Page", icon: <EyeIcon className="h-5 w-5" /> },
                  { id: "messages", name: "Messages", icon: <EnvelopeIcon className="h-5 w-5" /> },
                  { id: "settings", name: "Contact", icon: <ClockIcon className="h-5 w-5" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id ? "bg-gray-800 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6 relative">
                      {stat.editable && (
                        <button
                          onClick={() => handleEditStat(stat)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-gray-600 text-sm">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                          <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                        </div>
                        <div className={stat.color}>{stat.icon}</div>
                      </div>
                      <p className="text-xs text-gray-500">{stat.details}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Monthly Sales Goal</span>
                          <span>{dynamicStats.salesProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min(dynamicStats.salesProgress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{dynamicStats.isProfit ? "Profit Margin" : "Loss Margin"}</span>
                          <span>{Math.abs(dynamicStats.profitMargin)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${dynamicStats.isProfit ? "bg-green-600" : "bg-red-600"}`}
                            style={{ width: `${Math.min(Math.abs(dynamicStats.profitMargin), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Average Attendance</span>
                          <span>{dynamicStats.avgAttendance}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${dynamicStats.avgAttendance}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Productivity Score</span>
                          <span>{dynamicStats.productivityScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-600 h-2 rounded-full"
                            style={{ width: `${dynamicStats.productivityScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "employees" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-lg"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Employee Management</h2>
                    <button
                      onClick={() => setIsAddingEmployee(true)}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Employee</span>
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Salary
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees.map((employee) => {
                        return (
                          <tr key={employee.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                <div className="text-sm text-gray-500">{employee.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(employee.salary)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => setShowAttendanceCalendar(employee.id)}
                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                              >
                                {(() => {
                                  const stats = getAttendanceStats(employee)
                                  return `${stats.presentDays} days`
                                })()}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  employee.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {employee.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditEmployee(employee)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "products" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-lg"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Product Management</h2>
                    <button
                      onClick={() => setIsAddingProduct(true)}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold text-gray-800">{formatCurrency(product.price)}</span>
                            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-600">Sales: {product.sales}</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Attendance Calendar Modal */}
            {showAttendanceCalendar && (() => {
              const employee = employees.find(e => e.id === showAttendanceCalendar)
              if (!employee) return null
              
              const monthDates = getCurrentMonthDates(calendarMonth, calendarYear)
              const monthName = new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })
              const isCurrentMonth = calendarMonth === new Date().getMonth() && calendarYear === new Date().getFullYear()
              
              return (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => {
                  setShowAttendanceCalendar(null)
                  goToCurrentMonth()
                }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{employee.name} - Attendance</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <button
                            onClick={goToPreviousMonth}
                            className="text-gray-600 hover:text-gray-800"
                            title="Previous Month"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <p className="text-sm text-gray-600 font-semibold min-w-[140px] text-center">{monthName}</p>
                          <button
                            onClick={goToNextMonth}
                            className="text-gray-600 hover:text-gray-800"
                            title="Next Month"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          {!isCurrentMonth && (
                            <button
                              onClick={goToCurrentMonth}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                            >
                              Today
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowAttendanceCalendar(null)
                          goToCurrentMonth()
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Present</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Absent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span>On Leave</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
                        <span>Holiday</span>
                      </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {/* Day headers */}
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                          {day}
                        </div>
                      ))}
                      
                      {/* Empty cells for days before month starts */}
                      {Array.from({ length: monthDates[0]?.dayOfWeek || 0 }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square"></div>
                      ))}
                      
                      {/* Date cells */}
                      {monthDates.map(({ date, day, isToday }) => {
                        const status = getAttendanceStatus(employee, date)
                        let bgColor = 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                        let textColor = 'text-gray-700'
                        
                        if (status === 'present') {
                          bgColor = 'bg-green-500 hover:bg-green-600 border-green-600'
                          textColor = 'text-white'
                        } else if (status === 'absent') {
                          bgColor = 'bg-red-500 hover:bg-red-600 border-red-600'
                          textColor = 'text-white'
                        } else if (status === 'leave') {
                          bgColor = 'bg-yellow-500 hover:bg-yellow-600 border-yellow-600'
                          textColor = 'text-white'
                        }
                        
                        return (
                          <button
                            key={date}
                            onClick={() => toggleAttendanceStatus(employee.id, date)}
                            className={`aspect-square rounded-lg border-2 ${
                              bgColor
                            } ${textColor} font-semibold text-sm transition-all ${
                              isToday ? 'ring-2 ring-blue-400' : ''
                            } cursor-pointer hover:scale-105`}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      {(() => {
                        const counts = { present: 0, absent: 0, leave: 0 }
                        monthDates.forEach(({ date }) => {
                          const status = getAttendanceStatus(employee, date)
                          if (status === 'present') counts.present += 1
                          else if (status === 'absent') counts.absent += 1
                          else if (status === 'leave') counts.leave += 1
                        })
                        return (
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-green-600">
                                {counts.present}
                              </div>
                              <div className="text-sm text-gray-600">Days Present</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-red-600">
                                {counts.absent}
                              </div>
                              <div className="text-sm text-gray-600">Days Absent</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-yellow-600">
                                {counts.leave}
                              </div>
                              <div className="text-sm text-gray-600">Days On Leave</div>
                            </div>
                          </div>
                        )
                      })()}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          setShowAttendanceCalendar(null)
                          goToCurrentMonth()
                        }}
                        className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </div>
              )
            })()}

            {activeTab === "about" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-lg"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">About Page Content Management</h2>
                    {aboutContent.length === 0 && (
                      <button
                        onClick={handleUploadAboutData}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <ArrowUpTrayIcon className="h-5 w-5" />
                        Upload Initial Data
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Hero Section */}
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">HERO</span>
                        <h3 className="text-lg font-semibold text-gray-800 mt-2">Hero Section</h3>
                      </div>
                      <button
                        onClick={() => handleEditAboutSection('hero')}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Title:</strong> {getAboutItemBySection('hero').content?.title || 'About Ashrafi Engineers'}</p>
                      <p className="mt-1"><strong>Description:</strong> {getAboutItemBySection('hero').content?.description || 'Building excellence in metal fabrication...'}</p>
                    </div>
                  </div>

                  {/* Story Section */}
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">STORY</span>
                        <h3 className="text-lg font-semibold text-gray-800 mt-2">Company Story</h3>
                      </div>
                      <button
                        onClick={() => handleEditAboutSection('story')}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Title:</strong> {getAboutItemBySection('story').content?.title || 'Our Story'}</p>
                      <p className="mt-1 line-clamp-2"><strong>Content:</strong> {getAboutItemBySection('story').content?.paragraph1 || 'Ashrafi Engineers was founded...'}</p>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">STATS</span>
                        <h3 className="text-lg font-semibold text-gray-800 mt-2">Statistics</h3>
                      </div>
                      <button
                        onClick={() => handleEditAboutSection('stats')}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {(getAboutItemBySection('stats').content?.items || []).map((stat, idx) => (
                        <div key={idx} className="bg-gray-50 p-2 rounded">
                          <p className="font-bold text-gray-800">{stat.number}</p>
                          <p className="text-gray-600">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mission Section */}
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">MISSION</span>
                        <h3 className="text-lg font-semibold text-gray-800 mt-2">Mission Statement</h3>
                      </div>
                      <button
                        onClick={() => handleEditAboutSection('mission')}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {getAboutItemBySection('mission').content?.text || 'To provide exceptional metal fabrication services...'}
                    </p>
                  </div>

                  {/* Vision Section */}
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="px-3 py-1 bg-pink-100 text-pink-800 text-xs font-semibold rounded-full">VISION</span>
                        <h3 className="text-lg font-semibold text-gray-800 mt-2">Vision Statement</h3>
                      </div>
                      <button
                        onClick={() => handleEditAboutSection('vision')}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {getAboutItemBySection('vision').content?.text || 'To be the leading metal fabrication company...'}
                    </p>
                  </div>

                  {/* Team Section */}
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">TEAM</span>
                        <h3 className="text-lg font-semibold text-gray-800 mt-2">Team Members</h3>
                      </div>
                      <button
                        onClick={() => handleEditAboutSection('team')}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {(getAboutItemBySection('team').content?.members || []).map((member, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded flex items-center gap-3">
                          {member.image && (
                            <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">{member.name}</p>
                            <p className="text-gray-600">{member.position}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Values Section */}
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">VALUES</span>
                        <h3 className="text-lg font-semibold text-gray-800 mt-2">Company Values</h3>
                      </div>
                      <button
                        onClick={() => handleEditAboutSection('values')}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      {(getAboutItemBySection('values').content?.items || []).map((value, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded">
                          <p className="text-2xl mb-1">{value.icon}</p>
                          <p className="font-semibold text-gray-800">{value.title}</p>
                          <p className="text-gray-600 text-xs">{value.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "messages" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-lg"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Contact Messages</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                      {messages.length} Total Messages
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {messagesLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                      <EnvelopeIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No messages yet</p>
                      <p className="text-gray-400 text-sm mt-2">Messages from the contact form will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((message) => (
                          <div
                            key={message.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-800">{message.name}</h3>
                                  {message.status === 'unread' && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                      New
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-2">
                                    <EnvelopeIcon className="h-4 w-4" />
                                    <span>{message.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">📞</span>
                                    <span>{message.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">🔧</span>
                                    <span>{message.service || 'Not specified'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {new Date(message.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                <button
                                  onClick={async () => {
                                    if (window.confirm('Delete this message?')) {
                                      await deleteDocument('messages', message.id);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded p-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                              <p className="text-gray-600 whitespace-pre-wrap">{message.message}</p>
                            </div>
                            {message.status === 'unread' && (
                              <div className="mt-3 flex justify-end">
                                <button
                                  onClick={async () => {
                                    await updateDocument('messages', message.id, { status: 'read' });
                                  }}
                                  className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                  Mark as Read
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-lg"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Contact</h2>
                    <div className="text-sm text-gray-500">
                      Changes reflect across the entire website
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {settingsLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading settings...</div>
                  ) : (
                    <div className="space-y-6">
                      {/* Contact Information */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                              type="text"
                              value={editingSiteSettings ? editingSiteSettings.phone : siteSettings.phone}
                              onChange={(e) => setEditingSiteSettings({ ...(editingSiteSettings || siteSettings), phone: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                              placeholder="01711660004"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              value={editingSiteSettings ? editingSiteSettings.email : siteSettings.email}
                              onChange={(e) => setEditingSiteSettings({ ...(editingSiteSettings || siteSettings), email: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                              placeholder="info@ashrafienginfers.com"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Workshop Address</label>
                            <textarea
                              value={editingSiteSettings ? editingSiteSettings.address : siteSettings.address}
                              onChange={(e) => setEditingSiteSettings({ ...(editingSiteSettings || siteSettings), address: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                              rows="2"
                              placeholder="Workshop Location, Dhaka, Bangladesh"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                            <input
                              type="text"
                              value={editingSiteSettings ? editingSiteSettings.businessHours : siteSettings.businessHours}
                              onChange={(e) => setEditingSiteSettings({ ...(editingSiteSettings || siteSettings), businessHours: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                              placeholder="Mon - Sat: 8:00 AM - 6:00 PM"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Social Media Links */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Page URL</label>
                            <input
                              type="url"
                              value={editingSiteSettings ? editingSiteSettings.facebookUrl : siteSettings.facebookUrl}
                              onChange={(e) => setEditingSiteSettings({ ...(editingSiteSettings || siteSettings), facebookUrl: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                              placeholder="https://facebook.com/yourpage"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                            <input
                              type="text"
                              value={editingSiteSettings ? editingSiteSettings.whatsappNumber : siteSettings.whatsappNumber}
                              onChange={(e) => setEditingSiteSettings({ ...(editingSiteSettings || siteSettings), whatsappNumber: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                              placeholder="01711660004"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Workshop Information */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Workshop Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Workshop Description</label>
                            <textarea
                              value={editingSiteSettings ? editingSiteSettings.workshopDescription : siteSettings.workshopDescription}
                              onChange={(e) => setEditingSiteSettings({ ...(editingSiteSettings || siteSettings), workshopDescription: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                              rows="3"
                              placeholder="Our state-of-the-art workshop is equipped with modern machinery..."
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Facility Size</label>
                              <input
                                type="text"
                                value={editingSiteSettings ? editingSiteSettings.workshopSize : siteSettings.workshopSize}
                                onChange={(e) => setEditingSiteSettings({ ...(editingSiteSettings || siteSettings), workshopSize: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                placeholder="5000 sq ft"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                              <input
                                type="text"
                                value={editingSiteSettings ? editingSiteSettings.workshopCapacity : siteSettings.workshopCapacity}
                                onChange={(e) => setEditingSiteSettings({ ...(editingSiteSettings || siteSettings), workshopCapacity: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                placeholder="Large scale projects"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                              <input
                                type="text"
                                value={editingSiteSettings ? editingSiteSettings.workshopEquipment : siteSettings.workshopEquipment}
                                onChange={(e) => setEditingSiteSettings({ ...(editingSiteSettings || siteSettings), workshopEquipment: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                placeholder="Modern machinery"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                              <input
                                type="text"
                                value={editingSiteSettings ? editingSiteSettings.workshopTeam : siteSettings.workshopTeam}
                                onChange={(e) => setEditingSiteSettings({ ...(editingSiteSettings || siteSettings), workshopTeam: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                                placeholder="25+ skilled workers"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
                            <input
                              type="url"
                              value={editingSiteSettings ? editingSiteSettings.googleMapsUrl : siteSettings.googleMapsUrl}
                              onChange={(e) => setEditingSiteSettings({ ...(editingSiteSettings || siteSettings), googleMapsUrl: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                              placeholder="https://www.google.com/maps/embed?pb=..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe code
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={async () => {
                            const settingsToSave = editingSiteSettings || siteSettings;
                            const result = await updateSettings(settingsToSave);
                            if (result.success) {
                              alert('✅ Site settings updated successfully! Changes will reflect across the website.');
                              setEditingSiteSettings(null);
                            } else {
                              alert('❌ Failed to update settings: ' + result.error);
                            }
                          }}
                          className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                        >
                          <CheckIcon className="h-4 w-4" />
                          <span>Save Changes</span>
                        </button>
                        {editingSiteSettings && (
                          <button
                            onClick={() => setEditingSiteSettings(null)}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center space-x-2"
                          >
                            <XMarkIcon className="h-4 w-4" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>

                      {/* Current Settings Preview */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Settings Preview</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Phone:</span>
                            <span className="ml-2 text-gray-800">{siteSettings.phone}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Email:</span>
                            <span className="ml-2 text-gray-800">{siteSettings.email}</span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-600">Address:</span>
                            <span className="ml-2 text-gray-800">{siteSettings.address}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Facebook:</span>
                            <span className="ml-2 text-gray-800">{siteSettings.facebookUrl || 'Not set'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">WhatsApp:</span>
                            <span className="ml-2 text-gray-800">{siteSettings.whatsappNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "projects" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-lg"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Project Management</h2>
                    <button
                      onClick={() => setIsAddingProject(true)}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Project</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">Client: {project.client}</p>
                        <p className="text-sm text-gray-600 mb-2">Budget: {formatCurrency(project.budget)}</p>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              project.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : project.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {project.status}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProject(project)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {editingStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit {editingStats.title}</h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder={editingStats.title}
                value={editingStats.value}
                onChange={(e) => setEditingStats({ ...editingStats, value: Number.parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveStat}
                  className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingStats(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Employee</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editingEmployee.name}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Position"
                value={editingEmployee.position}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Salary"
                value={editingEmployee.salary}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, salary: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={editingEmployee.email}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={editingEmployee.status}
                onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
                <option value="Terminated">Terminated</option>
              </select>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveEmployee}
                  className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingEmployee(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Employee</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Position"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Salary"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={newEmployee.status}
                onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
                <option value="Terminated">Terminated</option>
              </select>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddEmployee}
                  className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAddingEmployee(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={editingProduct.category || "Shutters"}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Shutters">Shutters</option>
                <option value="Grills">Grills</option>
                <option value="Gates">Gates</option>
                <option value="Fencing">Fencing</option>
                <option value="Railings">Railings</option>
                <option value="Canopies">Canopies</option>
              </select>
              <textarea
                placeholder="Description"
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
              <input
                type="number"
                placeholder="Price"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Original Price (optional)"
                value={editingProduct.originalPrice || editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Stock"
                value={editingProduct.stock}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Sales"
                value={editingProduct.sales || 0}
                onChange={(e) => setEditingProduct({ ...editingProduct, sales: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Rating (0-5)"
                value={editingProduct.rating || 5}
                onChange={(e) => setEditingProduct({ ...editingProduct, rating: Number.parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Features (one per line)"
                value={Array.isArray(editingProduct.features) ? editingProduct.features.join('\n') : ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, features: e.target.value.split('\n').filter(f => f.trim()) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
              <ImageUpload
                value={editingProduct.image}
                onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
                label="Product Image"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editingProduct.inStock ?? true}
                  onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">In Stock</span>
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Product</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Shutters">Shutters</option>
                <option value="Grills">Grills</option>
                <option value="Gates">Gates</option>
                <option value="Fencing">Fencing</option>
                <option value="Railings">Railings</option>
                <option value="Canopies">Canopies</option>
                
              </select>
              <textarea
                placeholder="Product Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
              <input
                type="number"
                placeholder="Price (৳)"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Original Price (optional, ৳)"
                value={newProduct.originalPrice}
                onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Total Sales"
                value={newProduct.sales}
                onChange={(e) => setNewProduct({ ...newProduct, sales: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Rating (0-5)"
                value={newProduct.rating}
                onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Features (one per line)"
                value={Array.isArray(newProduct.features) ? newProduct.features.join('\n') : ''}
                onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value.split('\n').filter(f => f.trim()) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
              <ImageUpload
                value={newProduct.image}
                onChange={(url) => setNewProduct({ ...newProduct, image: url })}
                label="Product Image"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newProduct.inStock}
                  onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">In Stock</span>
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddProduct}
                  className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAddingProduct(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Project</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={editingProject.title}
                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={editingProject.category || "Shutters"}
                onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Shutters">Shutters</option>
                <option value="Grills & Railings">Grills & Railings</option>
                <option value="Gates">Gates</option>
                <option value="Security Grills">Security Grills</option>
                <option value="Steel Structure">Steel Structure</option>
                <option value="Sculpture">Sculpture</option>
              </select>
              <textarea
                placeholder="Description"
                value={editingProject.description || ""}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
              <input
                type="text"
                placeholder="Client"
                value={editingProject.client}
                onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Budget"
                value={editingProject.budget}
                onChange={(e) => setEditingProject({ ...editingProject, budget: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 3 months)"
                value={editingProject.duration || ""}
                onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="date"
                placeholder="Completion Date"
                value={editingProject.date || ""}
                onChange={(e) => setEditingProject({ ...editingProject, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Progress (%)"
                value={editingProject.progress}
                onChange={(e) => setEditingProject({ ...editingProject, progress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <ImageUpload
                value={editingProject.image || ""}
                onChange={(url) => setEditingProject({ ...editingProject, image: url })}
                label="Project Image"
              />
              <select
                value={editingProject.status}
                onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProject}
                  className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingProject(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Project</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={newProject.category}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Shutters">Shutters</option>
                <option value="Grills & Railings">Grills & Railings</option>
                <option value="Gates">Gates</option>
                <option value="Security Grills">Security Grills</option>
                <option value="Steel Structure">Steel Structure</option>
                <option value="Sculpture">Sculpture</option>
              </select>
              <textarea
                placeholder="Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
              <input
                type="text"
                placeholder="Client"
                value={newProject.client}
                onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Budget"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 3 months)"
                value={newProject.duration}
                onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="date"
                placeholder="Completion Date"
                value={newProject.date}
                onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Progress (%)"
                value={newProject.progress}
                onChange={(e) => setNewProject({ ...newProject, progress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <ImageUpload
                value={newProject.image}
                onChange={(url) => setNewProject({ ...newProject, image: url })}
                label="Project Image"
              />
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddProject}
                  className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAddingProject(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit About Item Modal */}
      {editingAboutItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-6 capitalize">Edit {editingAboutItem.section} Section</h3>
            <div className="space-y-4">
              {/* Hero Section Fields */}
              {editingAboutItem.section === 'hero' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={editingAboutItem.content.title || ''}
                      onChange={(e) => setEditingAboutItem({...editingAboutItem, content: {...editingAboutItem.content, title: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800"
                      placeholder="About Ashrafi Engineers"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={editingAboutItem.content.description || ''}
                      onChange={(e) => setEditingAboutItem({...editingAboutItem, content: {...editingAboutItem.content, description: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800"
                      rows={4}
                      placeholder="Building excellence in metal fabrication..."
                    />
                  </div>
                </>
              )}

              {/* Story Section Fields */}
              {editingAboutItem.section === 'story' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={editingAboutItem.content.title || ''}
                      onChange={(e) => setEditingAboutItem({...editingAboutItem, content: {...editingAboutItem.content, title: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800"
                      placeholder="Our Story"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 1</label>
                    <textarea
                      value={editingAboutItem.content.paragraph1 || ''}
                      onChange={(e) => setEditingAboutItem({...editingAboutItem, content: {...editingAboutItem.content, paragraph1: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 2</label>
                    <textarea
                      value={editingAboutItem.content.paragraph2 || ''}
                      onChange={(e) => setEditingAboutItem({...editingAboutItem, content: {...editingAboutItem.content, paragraph2: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 3</label>
                    <textarea
                      value={editingAboutItem.content.paragraph3 || ''}
                      onChange={(e) => setEditingAboutItem({...editingAboutItem, content: {...editingAboutItem.content, paragraph3: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800"
                      rows={3}
                    />
                  </div>
                  <ImageUpload
                    value={editingAboutItem.content.image || ''}
                    onChange={(url) => setEditingAboutItem({...editingAboutItem, content: {...editingAboutItem.content, image: url}})}
                    label="Story Image"
                  />
                </>
              )}

              {/* Stats Section Fields */}
              {editingAboutItem.section === 'stats' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statistics (JSON Array)</label>
                  <p className="text-xs text-gray-500 mb-2">Edit as JSON array: [{`{number:"500+", label:"Projects"}`}, ...]</p>
                  <textarea
                    value={JSON.stringify(editingAboutItem.content.items || [], null, 2)}
                    onChange={(e) => {
                      try {
                        const items = JSON.parse(e.target.value);
                        setEditingAboutItem({...editingAboutItem, content: {...editingAboutItem.content, items}});
                      } catch (err) {
                        // Invalid JSON, keep typing
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 font-mono text-sm"
                    rows={10}
                  />
                </div>
              )}

              {/* Mission/Vision Fields */}
              {(editingAboutItem.section === 'mission' || editingAboutItem.section === 'vision') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                  <textarea
                    value={editingAboutItem.content.text || ''}
                    onChange={(e) => setEditingAboutItem({...editingAboutItem, content: {...editingAboutItem.content, text: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800"
                    rows={5}
                  />
                </div>
              )}

              {/* Team Section Fields */}
              {editingAboutItem.section === 'team' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Members (JSON Array)</label>
                  <p className="text-xs text-gray-500 mb-2">Edit as JSON array: [{`{name:"...", position:"...", image:"...", description:"..."}`}, ...]</p>
                  <textarea
                    value={JSON.stringify(editingAboutItem.content.members || [], null, 2)}
                    onChange={(e) => {
                      try {
                        const members = JSON.parse(e.target.value);
                        setEditingAboutItem({...editingAboutItem, content: {...editingAboutItem.content, members}});
                      } catch (err) {
                        // Invalid JSON, keep typing
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 font-mono text-sm"
                    rows={15}
                  />
                </div>
              )}

              {/* Values Section Fields */}
              {editingAboutItem.section === 'values' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Values (JSON Array)</label>
                  <p className="text-xs text-gray-500 mb-2">Edit as JSON array: [{`{icon:"🎯", title:"...", description:"..."}`}, ...]</p>
                  <textarea
                    value={JSON.stringify(editingAboutItem.content.items || [], null, 2)}
                    onChange={(e) => {
                      try {
                        const items = JSON.parse(e.target.value);
                        setEditingAboutItem({...editingAboutItem, content: {...editingAboutItem.content, items}});
                      } catch (err) {
                        // Invalid JSON, keep typing
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 font-mono text-sm"
                    rows={15}
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveAboutItem}
                  className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 font-medium"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingAboutItem(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11)
      setCalendarYear(calendarYear - 1)
    } else {
      setCalendarMonth(calendarMonth - 1)
    }
  }

  // Navigate to next month
  const goToNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0)
      setCalendarYear(calendarYear + 1)
    } else {
      setCalendarMonth(calendarMonth + 1)
    }
  }

  // Go to current month
  const goToCurrentMonth = () => {
    setCalendarMonth(new Date().getMonth())
    setCalendarYear(new Date().getFullYear())
  }

export default AdminDashboard
