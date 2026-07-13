/**
 * Google Analytics 4 Tracking
 * Domain agnostic setup - works with any domain
 */

// Event types for tracking
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, eventData);
  }
};

// Product tracking events
export const productEvents = {
  /**
   * Track when user views a product
   */
  viewProduct: (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
    image?: string;
  }) => {
    trackEvent("view_item", {
      currency: "INR",
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category || "Activewear",
          price: product.price,
          item_brand: "WALKUS",
        },
      ],
    });
  },

  /**
   * Track when user selects options (size/color)
   */
  selectItemVariation: (product: { id: string; name: string }, variation: { size?: string; color?: string }) => {
    trackEvent("select_item", {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_variant: [variation.size, variation.color].filter(Boolean).join(" - "),
        },
      ],
    });
  },

  /**
   * Track add to cart
   */
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
  }, quantity: number) => {
    trackEvent("add_to_cart", {
      currency: "INR",
      value: product.price * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category || "Activewear",
          price: product.price,
          quantity,
          item_brand: "WALKUS",
        },
      ],
    });
  },

  /**
   * Track purchase
   */
  purchase: (order: {
    id: string;
    revenue: number;
    tax?: number;
    shipping?: number;
    items: Array<{ id: string; name: string; price: number; quantity: number; category?: string }>;
  }) => {
    trackEvent("purchase", {
      transaction_id: order.id,
      currency: "INR",
      value: order.revenue,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      items: order.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category || "Activewear",
        price: item.price,
        quantity: item.quantity,
        item_brand: "WALKUS",
      })),
    });
  },
};

// Checkout tracking events
export const checkoutEvents = {
  /**
   * Track checkout initiation
   */
  beginCheckout: (items: Array<{ id: string; name: string; price: number; quantity: number }>, total: number) => {
    trackEvent("begin_checkout", {
      currency: "INR",
      value: total,
      items: items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },

  /**
   * Track checkout progress
   */
  checkoutProgress: (step: "shipping" | "payment" | "confirmation", value: number) => {
    trackEvent("checkout_progress", {
      checkout_step: step,
      checkout_option: `step_${value}`,
    });
  },

  /**
   * Track purchase completion
   */
  purchaseComplete: (order: { id: string; revenue: number; items: any[] }) => {
    trackEvent("purchase", {
      transaction_id: order.id,
      currency: "INR",
      value: order.revenue,
      items: order.items,
    });
  },
};

// Engagement tracking
export const engagementEvents = {
  /**
   * Track page scroll
   */
  scrollDepth: (depth: "25" | "50" | "75" | "100") => {
    trackEvent("scroll", {
      percent_scrolled: depth,
    });
  },

  /**
   * Track time on page
   */
  engagementTime: (seconds: number) => {
    trackEvent("user_engagement", {
      engagement_time_msec: seconds * 1000,
    });
  },

  /**
   * Track video plays
   */
  videoPlay: (videoTitle: string) => {
    trackEvent("video_start", {
      video_title: videoTitle,
    });
  },

  /**
   * Track form interactions
   */
  formInteraction: (formName: string, fieldName: string) => {
    trackEvent("form_start", {
      form_name: formName,
      form_destination: fieldName,
    });
  },

  /**
   * Track form submission
   */
  formSubmit: (formName: string) => {
    trackEvent("form_submit", {
      form_name: formName,
    });
  },
};

// CRO - Conversion Rate Optimization tracking
export const croEvents = {
  /**
   * Track button clicks for CRO
   */
  buttonClick: (buttonName: string, buttonType: string) => {
    trackEvent("click", {
      button_name: buttonName,
      button_type: buttonType,
    });
  },

  /**
   * Track email signup
   */
  newsletterSignup: () => {
    trackEvent("newsletter_signup", {
      newsletter_name: "WALKUS Newsletter",
    });
  },

  /**
   * Track search
   */
  search: (searchTerm: string, resultsCount: number) => {
    trackEvent("search", {
      search_term: searchTerm,
      number_of_results: resultsCount,
    });
  },

  /**
   * Track view item list
   */
  viewItemList: (listName: string, items: any[]) => {
    trackEvent("view_item_list", {
      item_list_name: listName,
      items,
    });
  },

  /**
   * Track exception/error for CRO
   */
  trackError: (errorName: string, errorDescription: string) => {
    trackEvent("exception", {
      description: `${errorName}: ${errorDescription}`,
      fatal: false,
    });
  },
};

// Initialize GA4 in useEffect
export const initializeGA = (measurementId: string) => {
  if (typeof window !== "undefined") {
    // Load gtag script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(arguments);
    }
    (window as any).gtag = gtag;
    gtag("js", new Date());
    gtag("config", measurementId, {
      page_path: window.location.pathname,
      // Cookie flags for compliance
      allow_google_signals: false,
      anonymize_ip: true,
    });
  }
};
