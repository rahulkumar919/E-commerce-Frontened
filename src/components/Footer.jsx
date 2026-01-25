import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ShoppingCart,
  Heart,
  CreditCard,
  Shield,
  Truck,
  RotateCcw,
  Send,
  CheckCircle,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-300 mt-20 overflow-hidden border-t border-gray-800/50">
      {/* Glowing Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 animate-pulse"></div>

      {/* Ambient Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-pink-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-orange-500/10 blur-3xl rounded-full"></div>
      </div>

      {/* Trust Section */}
      <div className="relative border-b border-gray-800/50 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Truck />, title: "Free Shipping", desc: "On orders over ₹999", color: "from-red-500 to-orange-500" },
            { icon: <RotateCcw />, title: "Easy Returns", desc: "30 days return policy", color: "from-blue-500 to-cyan-500" },
            { icon: <Shield />, title: "Secure Payment", desc: "100% SSL Protected", color: "from-green-500 to-emerald-500" },
            { icon: <Heart />, title: "24/7 Support", desc: "Dedicated Helpdesk", color: "from-pink-500 to-rose-500" },
          ].map((item, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center transition-transform hover:scale-105"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white shadow-md shadow-gray-800/30 mb-3 group-hover:shadow-lg group-hover:shadow-${item.color.split(' ')[1]}/40 transition-all`}
              >
                {item.icon}
              </div>
              <h4 className="text-white font-bold">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-[1300px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
        {/* About */}
        <div className="lg:col-span-4">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/40 mr-3">
              <ShoppingCart className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-white text-2xl font-extrabold tracking-wide">
              Dynamic Store
            </h3>
          </div>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Experience premium shopping with exclusive collections and unbeatable
            deals. Fast delivery, secure payments, and 24/7 support — all in one
            place.
          </p>

          {/* Social Media */}
          <div className="flex space-x-3">
            {[
              { icon: <Facebook />, color: "from-blue-600 to-blue-800" },
              { icon: <Twitter />, color: "from-sky-400 to-sky-600" },
              { icon: <Instagram />, color: "from-pink-600 to-rose-600" },
              { icon: <Linkedin />, color: "from-blue-700 to-indigo-800" },
            ].map((item, i) => (
              <a
                key={i}
                href="#"
                className={`w-10 h-10 bg-gray-800 hover:bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center transition-all duration-300 group`}
              >
                <div className="text-gray-400 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-2">
          <h3 className="text-white text-lg font-bold mb-6 border-b-2 border-gradient-to-r from-orange-500 to-red-500 w-fit pb-1">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {["About Us", "Shop", "Offers", "Blog", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-all duration-200 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300"></span>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div className="lg:col-span-2">
          <h3 className="text-white text-lg font-bold mb-6 border-b-2 border-gradient-to-r from-orange-500 to-red-500 w-fit pb-1">
            Customer Care
          </h3>
          <ul className="space-y-3">
            {[
              "Track Order",
              "Returns & Refunds",
              "Shipping Policy",
              "Privacy Policy",
              "Help Center",
            ].map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-gray-400 hover:text-orange-400 transition-all duration-200 flex items-center gap-2 group"
                >
                  <span className="inline-block w-0 h-0.5 bg-orange-500 group-hover:w-3 transition-all duration-300"></span>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="lg:col-span-4">
          <h3 className="text-white text-lg font-bold mb-6 border-b-2 border-gradient-to-r from-orange-500 to-red-500 w-fit pb-1">
            Stay Updated
          </h3>
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 shadow-inner">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Mail className="text-orange-400 w-5 h-5" /> Newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Get exclusive offers and updates right in your inbox.
            </p>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-900 text-white px-4 py-3 pr-12 rounded-xl text-sm border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <button
                onClick={handleSubscribe}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110"
              >
                {subscribed ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            {subscribed && (
              <p className="text-green-400 text-xs mt-2 animate-pulse">
                ✓ Subscribed successfully!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800/50 bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <p>
            © {currentYear} Dynamic Store. Crafted with{" "}
            <Heart className="inline w-4 h-4 text-red-500 animate-pulse" /> by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-bold">
              Rahul Sahu
            </span>
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-400 transition-colors">
              Terms
            </a>
            <span>•</span>
            <a href="#" className="hover:text-orange-400 transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
