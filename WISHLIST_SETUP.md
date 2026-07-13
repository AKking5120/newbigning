# Wishlist Feature Setup Instructions

## ✅ Already Completed

1. **Wishlist Store** (`store/wishlist.ts`)
   - Zustand store with localStorage persistence
   - Methods: `addItem()`, `removeItem()`, `toggleItem()`, `isWishlisted()`, `clearWishlist()`

2. **ProductCard Component** (`components/product/ProductCard.tsx`)
   - ✅ Imported `useWishlistStore`
   - ✅ Implemented `handleWishlist()` function with toggle logic
   - ✅ Heart button shows filled heart when wishlisted
   - ✅ Conditional styling (crimson bg when wishlisted)
   - ✅ Toast notifications on add/remove

3. **WishlistDrawer Component** (`components/wishlist/WishlistDrawer.tsx`)
   - ✅ Full drawer UI with all wishlist items
   - ✅ Add to cart functionality
   - ✅ Remove item button
   - ✅ Clear wishlist button
   - ✅ Empty state message
   - ✅ Uses luxury color palette (crimson, pearl, obsidian)

## 🔧 Manual Integration Required

### Step 1: Import WishlistDrawer in Navbar

At the top of `components/layout/Navbar.tsx`, add:

```typescript
import { WishlistDrawer } from "@/components/wishlist/WishlistDrawer";
import { useWishlistStore } from "@/store/wishlist";
```

### Step 2: Add State in Navbar Component

In the `Navbar()` function, after existing state declarations:

```typescript
const [wishlistOpen, setWishlistOpen] = useState(false);
const { items: wishlistItems } = useWishlistStore();
```

### Step 3: Update Heart Button in Navbar

Find the heart button in the Icons section (around line 220) and replace:

```typescript
{/* OLD CODE - REMOVE THIS */}
<button className="hidden sm:flex text-zinc-400 hover:text-white transition-colors p-1 relative">
  <Heart className="w-5 h-5" />
</button>

{/* NEW CODE - ADD THIS */}
<button 
  onClick={() => setWishlistOpen(true)}
  className="hidden sm:flex text-zinc-400 hover:text-white transition-colors p-1 relative"
  aria-label={`Wishlist, ${wishlistItems.length} items`}
>
  <Heart className="w-5 h-5" />
  {wishlistItems.length > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
      {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
    </span>
  )}
</button>
```

### Step 4: Add WishlistDrawer at End of Navbar

Before the closing `</header>` tag (after mobile nav section), add:

```typescript
{/* Wishlist Drawer */}
<WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
```

## 🧪 Testing Wishlist Flow

1. **Open app** and browse to `/store`
2. **Hover over product card** → heart button appears
3. **Click heart button** → 
   - Toast shows "Added to wishlist"
   - Heart fills with crimson color and pearl fill
   - Wishlist count badge appears in navbar
4. **Click wishlist icon in navbar** → drawer opens from right
5. **In drawer**:
   - See all wishlisted products
   - Click "Cart" button → adds to cart, closes drawer
   - Click trash icon → removes from wishlist
   - Click "Clear All" → clears entire wishlist
6. **Refresh page** → wishlist items persist (localStorage)
7. **On product detail page** → heart button shows filled if wishlisted

## 📱 Mobile Support

- Heart button on product cards works on mobile
- Wishlist drawer opens as full-screen overlay on mobile
- Drawer closes when item is clicked or close button is pressed

## 🎨 Color Palette Used

- **Crimson**: `#710014` - Primary action color
- **Pearl**: `#F2F1ED` - Text on dark backgrounds
- **Obsidian**: `#161616` - Dark background
- **Sand**: `#B38F6F` - Accent color (optional)

## 🔗 File Structure

```
components/
  └── wishlist/
      └── WishlistDrawer.tsx        ← New component
  └── product/
      └── ProductCard.tsx           ← Modified (wishlist button)
  └── layout/
      └── Navbar.tsx               ← To be modified (add drawer integration)

store/
  └── wishlist.ts                  ← Existing store
```

## ✨ Features

- ✅ Add/remove items from wishlist
- ✅ Persistent storage (localStorage)
- ✅ Visual feedback (filled heart, toast notifications)
- ✅ Add to cart from wishlist
- ✅ Clear entire wishlist
- ✅ Item count badge in navbar
- ✅ Empty state message
- ✅ Mobile responsive
- ✅ Luxury color theme applied
