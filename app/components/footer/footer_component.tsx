import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { shopPreferences } from '@prisma/client';

const Footer = ({metaData}:{metaData:shopPreferences}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-900 text-gray-300 bottom-0">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:flex md: justify-between gap-8">
          {/* Company Info */}
          <div className="flex">
            <div  className='max-w-md'>
            <h4 className="text-lg font-semibold text-white mb-4">{metaData.shopName}</h4>
              <p className="text-gray-400 mb-6">Bringing quality products and exceptional service to our customers since 2020.</p>
            </div>
            <div className="space-y-3 md:px-4">
              <a href="mailto:shop@example.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                {metaData.email}
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                {metaData.phoneNumber}
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                {metaData.address}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              {[
                { href: metaData.facebookLink, label: "Facebook", icon: '/facebook.png' },
                { href: metaData.TikTokLink, label: "TikTok", icon: '/TikTok.png' },
                { href: metaData.instagramLink, label: "Instagram", icon: '/instagram.png' }
                          ].map((social) => {
                              if (social.href) {
                                  return (
                                    <a
                                              href={social.href}
                                              key={social.label}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                      aria-label={social.label}
                                    >
                                     <Image src={social.icon} alt={social.label} width={20} height={20} />
                                    </a>
                      )
                  }
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} {metaData.shopName}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;