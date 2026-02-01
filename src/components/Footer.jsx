import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/solid';
import useSiteSettings from '../hooks/useSiteSettings';

const Footer = () => {
  const { settings } = useSiteSettings();
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center text-white font-bold">
                AE
              </div>
              <div>
                <h3 className="text-xl font-bold">Ashrafi Engineers</h3>
                <p className="text-gray-400">Committed to Best Quality</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Leading metal fabrication company specializing in shutters, grills, welding, 
              mechanical projects, and sculpture works. Quality craftsmanship since establishment.
            </p>
            <div className="flex space-x-4">
              <a 
                href={settings.facebookUrl || '#'} 
                target={settings.facebookUrl ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href={`mailto:${settings.email}`} className="text-gray-400 hover:text-gray-300 transition-colors">
                <EnvelopeIcon className="w-6 h-6" />
              </a>
              <a 
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="/about" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
              <a href="/services" className="block text-gray-400 hover:text-white transition-colors">Services</a>
              <a href="/projects" className="block text-gray-400 hover:text-white transition-colors">Projects</a>
              <a href="/products" className="block text-gray-400 hover:text-white transition-colors">Products</a>
              <a href="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <h4 className="text-lg font-semibold mb-4">Visit Our Workshop</h4>
          {settings.googleMapsUrl ? (
            <div className="rounded-lg overflow-hidden h-64">
              <iframe
                src={settings.googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Workshop Location"
              ></iframe>
            </div>
          ) : (
            <div className="bg-gray-700 rounded-lg p-4 h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                <p className="text-gray-400">Map location not configured</p>
                <p className="text-gray-500 text-sm mt-1">Add Google Maps URL in admin settings</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 Ashrafi Engineers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;