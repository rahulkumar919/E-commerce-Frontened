import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ShoppingBag,
  Send,
  CheckCircle,
  ArrowRight,
  Youtube,
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { siteSettings, loading } = useSiteSettings();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  if (loading) {
    return null; // or a loading skeleton
  }

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                {siteSettings.siteName || "ShopHub"}
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop destination for quality products at amazing prices. Shop with confidence and enjoy fast, secure delivery.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 pt-2">
              {siteSettings.socialLinks?.facebook && (
                <a
                  href={siteSettings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              )}
              {siteSettings.socialLinks?.twitter && (
                <a
                  href={siteSettings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-sky-500 transition-all duration-300 group"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              )}
              {siteSettings.socialLinks?.instagram && (
                <a
                  href={siteSettings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-all duration-300 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              )}
              {siteSettings.socialLinks?.youtube && (
                <a
                  href={siteSettings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-all duration-300 group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              )}
              {siteSettings.socialLinks?.linkedin && (
                <a
                  href={siteSettings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              )}
              {siteSettings.socialLinks?.github && (
                <a
                  href={siteSettings.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-all duration-300 group"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              )}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-3">
              {[
                { name: "New Arrivals", path: "/" },
                { name: "Best Sellers", path: "/" },
                { name: "Special Offers", path: "/" },
                { name: "Gift Cards", path: "/" },
                { name: "All Products", path: "/" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <ArrowRight className="w-0 h-4 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {[
                { name: "Help Center", path: "/" },
                { name: "Track Order", path: "/" },
                { name: "Returns", path: "/" },
                { name: "Shipping Info", path: "/" },
                { name: "FAQs", path: "/" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center group text-sm"
                  >
                    <ArrowRight className="w-0 h-4 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Stay Connected</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full bg-gray-800 text-white px-4 py-3 pr-12 rounded-lg text-sm border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 w-8 h-8 flex items-center justify-center rounded-md transition-all duration-300 hover:scale-110"
                >
                  {subscribed ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
              
              {subscribed && (
                <p className="text-green-400 text-xs flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Thanks for subscribing!
                </p>
              )}
            </form>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              {siteSettings.sitePhone && (
                <a
                  href={`tel:${siteSettings.sitePhone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>{siteSettings.sitePhone}</span>
                </a>
              )}
              {siteSettings.siteEmail && (
                <a
                  href={`mailto:${siteSettings.siteEmail}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>{siteSettings.siteEmail}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p className="text-center md:text-left">
              © {currentYear} {siteSettings.siteName || "ShopHub"}. All rights reserved. Made with ❤️ in India
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/" className="hover:text-red-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/" className="hover:text-red-500 transition-colors">
                Terms of Service
              </Link>
              <Link to="/" className="hover:text-red-500 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
