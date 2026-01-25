import React from "react";
import { X } from "lucide-react"; // optional icon for close button

const DisplayImage = ({ imgUrl, onClose }) => {
  if (!imgUrl) return null; // safety check

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      {/* Background overlay click closes the modal */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      ></div>

      {/* Image container */}
      <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-[90%] max-h-[90vh] flex flex-col items-center justify-center animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-red-600 transition"
          title="Close"
        >
          <X size={24} />
        </button>

        {/* Image */}
        <img
          src={imgUrl}
          alt="Preview"
          className="object-contain w-full h-[80vh] p-3"
        />
      </div>
    </div>
  );
};

export default DisplayImage;
