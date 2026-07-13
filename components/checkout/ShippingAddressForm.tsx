"use client";

import { useState } from "react";
import { useCheckoutStore, ShippingAddress } from "@/store/checkout";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface AddressFormProps {
  onComplete?: () => void;
}

/**
 * Shipping Address Form Component
 * Input fields, validation, save address functionality
 */
export function ShippingAddressForm({ onComplete }: AddressFormProps) {
  const {
    shippingAddress,
    savedAddresses,
    setShippingAddress,
    addSavedAddress,
    removeSavedAddress,
  } = useCheckoutStore();

  const [isEditing, setIsEditing] = useState(!shippingAddress);
  const [showSaved, setShowSaved] = useState(false);
  const [formData, setFormData] = useState<ShippingAddress>(
    shippingAddress || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      newErrors.phone = "Invalid phone (10 digits)";
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address required";
    if (!formData.city.trim()) newErrors.city = "City required";
    if (!formData.state.trim()) newErrors.state = "State required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code required";
    else if (!/^\d{6}$/.test(formData.postalCode.replace(/\D/g, "")))
      newErrors.postalCode = "Invalid postal code (6 digits)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShippingAddress(formData);
      toast.success("Address saved successfully");
      setIsEditing(false);
      onComplete?.();
    }
  };

  const handleSaveNew = () => {
    if (validateForm()) {
      addSavedAddress(formData);
      toast.success("Address saved for future orders");
    }
  };

  const handleSelectSaved = (address: ShippingAddress) => {
    setFormData(address);
    setShippingAddress(address);
    setShowSaved(false);
    setIsEditing(false);
    toast.success("Address selected");
    onComplete?.();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (!isEditing && shippingAddress) {
    return (
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white">Delivery Address</h3>
              <p className="text-zinc-400 text-sm mt-1">
                {formData.firstName} {formData.lastName}
              </p>
              <p className="text-zinc-400 text-sm">
                {formData.addressLine1}
                {formData.addressLine2 && `, ${formData.addressLine2}`}
              </p>
              <p className="text-zinc-400 text-sm">
                {formData.city}, {formData.state} {formData.postalCode}
              </p>
              <p className="text-zinc-400 text-sm">{formData.phone}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-red-600 hover:text-red-500 font-semibold text-sm"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
      <h3 className="font-black text-white tracking-widest uppercase mb-6">
        Shipping Address
      </h3>

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div className="mb-6 pb-6 border-b border-zinc-800">
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-3"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showSaved ? "rotate-180" : ""}`} />
            <span className="text-sm font-semibold">Use Saved Address</span>
            <span className="text-xs bg-zinc-800 px-2 py-1 rounded">
              {savedAddresses.length}
            </span>
          </button>

          {showSaved && (
            <div className="space-y-2">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-3 bg-zinc-800 rounded cursor-pointer hover:bg-zinc-700 transition-colors"
                  onClick={() => handleSelectSaved(addr)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white text-sm font-semibold">
                        {addr.firstName} {addr.lastName}
                      </p>
                      <p className="text-zinc-400 text-xs">
                        {addr.addressLine1}, {addr.city}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSavedAddress(addr.id!);
                        toast.success("Address removed");
                      }}
                      className="text-red-600 hover:text-red-500 text-xs font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-zinc-800 border rounded text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors ${
                errors.firstName ? "border-red-600" : "border-zinc-700"
              }`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-zinc-800 border rounded text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors ${
                errors.lastName ? "border-red-600" : "border-zinc-700"
              }`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-zinc-800 border rounded text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors ${
                errors.email ? "border-red-600" : "border-zinc-700"
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-zinc-800 border rounded text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors ${
                errors.phone ? "border-red-600" : "border-zinc-700"
              }`}
              placeholder="9876543210"
            />
            {errors.phone && (
              <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
            Address Line 1 *
          </label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-zinc-800 border rounded text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors ${
              errors.addressLine1 ? "border-red-600" : "border-zinc-700"
            }`}
            placeholder="123 Main Street"
          />
          {errors.addressLine1 && (
            <p className="text-red-600 text-xs mt-1">{errors.addressLine1}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
            Address Line 2
          </label>
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
            placeholder="Apartment, Suite, etc. (optional)"
          />
        </div>

        {/* City, State, Postal */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-zinc-800 border rounded text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors ${
                errors.city ? "border-red-600" : "border-zinc-700"
              }`}
              placeholder="Mumbai"
            />
            {errors.city && (
              <p className="text-red-600 text-xs mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-zinc-800 border rounded text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors ${
                errors.state ? "border-red-600" : "border-zinc-700"
              }`}
              placeholder="Maharashtra"
            />
            {errors.state && (
              <p className="text-red-600 text-xs mt-1">{errors.state}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              Postal Code *
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-zinc-800 border rounded text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors ${
                errors.postalCode ? "border-red-600" : "border-zinc-700"
              }`}
              placeholder="400001"
            />
            {errors.postalCode && (
              <p className="text-red-600 text-xs mt-1">{errors.postalCode}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
            Country
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:border-red-600 transition-colors"
          >
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
            <option>Canada</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            Save Address
          </Button>
          <Button
            type="button"
            onClick={handleSaveNew}
            variant="outline"
            className="text-zinc-300 hover:text-white border-zinc-700 hover:border-zinc-600"
          >
            Save for Later
          </Button>
        </div>
      </form>
    </div>
  );
}
