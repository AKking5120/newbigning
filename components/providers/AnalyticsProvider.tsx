"use client";

import { useEffect } from "react";
import { initializeGA } from "@/lib/analytics";

interface AnalyticsProviderProps {
  children: React.ReactNode;
  measurementId?: string;
}

/**
 * Analytics Provider Component
 * Initializes Google Analytics 4
 * 
 * Usage in layout:
 * <AnalyticsProvider measurementId="G-XXXXXXXXXX">
 *   {children}
 * </AnalyticsProvider>
 * 
 * Get measurementId from Google Analytics dashboard
 * Works with any domain - domain agnostic setup
 */
export function AnalyticsProvider({ children, measurementId }: AnalyticsProviderProps) {
  useEffect(() => {
    // Initialize GA4 when component mounts
    if (measurementId) {
      initializeGA(measurementId);
    }
  }, [measurementId]);

  return <>{children}</>;
}
