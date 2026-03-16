import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";

const Sidebar = ({ tabs, activeTab, setActiveTab, isOpen, onClose }) => {
  return (
    <div className={`w-64 bg-white border-r border-neutral-200 fixed h-full flex flex-col pt-8 z-30 transition-transform duration-300 transform lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="px-8 mb-12 flex items-center justify-between">
        <div>
          <span
            className="text-2xl tracking-widest uppercase font-light text-gold-500"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
          >
            Lumière
          </span>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
            Admin Portal
          </p>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-neutral-400 hover:text-neutral-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col space-y-2 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest font-medium rounded-sm transition-all ${
              activeTab === tab.id
                ? "bg-neutral-900 text-white shadow-md"
                : "text-neutral-500 hover:bg-cream-50 hover:text-neutral-900"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-auto mb-8 px-4 w-full">
        <Link
          to="/shop"
          className="flex items-center gap-3 w-full px-4 py-3 text-xs uppercase tracking-widest font-bold bg-cream-50 text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all rounded-sm border border-neutral-200"
        >
          <ArrowLeft className="w-4 h-4" /> Exit to Store
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
