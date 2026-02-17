import React, { createContext, useState, useEffect, useContext } from "react";
import SummaryApi from "../../common";

const SiteSettingsContext = createContext(null);

export const SiteSettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState({
    siteName: "ShopHub",
    siteEmail: "support@shophub.com",
    sitePhone: "+91 123 456 7890",
    siteAddress: "India",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      github: "",
    },
    seoSettings: {
      metaTitle: "ShopHub - Your Shopping Destination",
      metaDescription: "Shop quality products at amazing prices",
      metaKeywords: "ecommerce, shopping, online store",
    },
  });
  const [loading, setLoading] = useState(true);

  // Fetch site settings
  const fetchSiteSettings = async () => {
    try {
      const response = await fetch(SummaryApi.getSiteSettings.url, {
        method: SummaryApi.getSiteSettings.method,
      });

      const data = await response.json();

      if (data.success) {
        setSiteSettings(data.data);
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  // Update document title when settings change
  useEffect(() => {
    if (siteSettings.seoSettings?.metaTitle) {
      document.title = siteSettings.seoSettings.metaTitle;
    }
  }, [siteSettings]);

  return (
    <SiteSettingsContext.Provider
      value={{ siteSettings, loading, fetchSiteSettings }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }
  return context;
};

export default SiteSettingsContext;
