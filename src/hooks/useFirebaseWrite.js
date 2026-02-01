import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Firebase Write Operations Hook
 * Handles Create, Update, Delete operations for Firestore
 */

// ============ CREATE OPERATIONS ============

/**
 * Add a new document to a collection
 * @param {string} collectionName - Name of the collection (e.g., 'products', 'employees', 'projects')
 * @param {object} data - Data to add to the document
 * @returns {Promise} - Returns promise with document reference
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log(`✓ ${collectionName} added with ID:`, docRef.id);
    return docRef;
  } catch (error) {
    console.error(`✗ Error adding to ${collectionName}:`, error);
    throw error;
  }
};

// ============ UPDATE OPERATIONS ============

/**
 * Update an existing document in a collection
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - ID of the document to update
 * @param {object} data - Updated data (partial or complete)
 * @returns {Promise} - Returns promise with update status
 */
export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data);
    console.log(`✓ ${collectionName} with ID ${documentId} updated successfully`);
    return true;
  } catch (error) {
    console.error(`✗ Error updating ${collectionName}:`, error);
    throw error;
  }
};

// ============ DELETE OPERATIONS ============

/**
 * Delete a document from a collection
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - ID of the document to delete
 * @returns {Promise} - Returns promise with delete status
 */
export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    console.log(`✓ ${collectionName} with ID ${documentId} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`✗ Error deleting from ${collectionName}:`, error);
    throw error;
  }
};

// ============ HELPER FUNCTIONS ============

/**
 * Batch update multiple documents
 * @param {string} collectionName - Name of the collection
 * @param {array} updates - Array of {id, data} objects
 * @returns {Promise} - Returns promise with status
 */
export const batchUpdate = async (collectionName, updates) => {
  try {
    const promises = updates.map(({ id, data }) =>
      updateDoc(doc(db, collectionName, id), data)
    );
    await Promise.all(promises);
    console.log(`✓ Batch updated ${updates.length} documents in ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`✗ Error in batch update:`, error);
    throw error;
  }
};

/**
 * Batch delete multiple documents
 * @param {string} collectionName - Name of the collection
 * @param {array} documentIds - Array of document IDs to delete
 * @returns {Promise} - Returns promise with status
 */
export const batchDelete = async (collectionName, documentIds) => {
  try {
    const promises = documentIds.map(id =>
      deleteDoc(doc(db, collectionName, id))
    );
    await Promise.all(promises);
    console.log(`✓ Batch deleted ${documentIds.length} documents from ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`✗ Error in batch delete:`, error);
    throw error;
  }
};

/**
 * Increment a numeric field in a document
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - ID of the document
 * @param {string} fieldName - Name of the field to increment
 * @param {number} value - Value to increment by (default: 1)
 * @returns {Promise} - Returns promise with update status
 */
export const incrementField = async (collectionName, documentId, fieldName, value = 1) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      [fieldName]: (await docRef.get())[fieldName] + value || value
    });
    console.log(`✓ ${fieldName} incremented in ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`✗ Error incrementing field:`, error);
    throw error;
  }
};
