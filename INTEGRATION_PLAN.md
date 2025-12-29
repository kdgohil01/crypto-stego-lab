# Steganography Integration Plan

## Overview
Integrating advanced file-in-image steganography features from **Stego 2.0** into the main **crypto-stego-lab** project.

---

## Source Project Analysis

### Components to Integrate:
1. **EmbedPanel.tsx** - Main UI for embedding files in images
2. **ExtractPanel.tsx** - Main UI for extracting files from images
3. **DropZone.tsx** - Drag & drop file upload component
4. **FilePreview.tsx** - File preview with icons
5. **PasswordInput.tsx** - Password input with strength indicator
6. **CapacityIndicator.tsx** - Capacity analysis display

### Library Files to Integrate:
1. **steganography.ts** - LSB steganography (2 LSBs per channel, RGB)
2. **file-processor.ts** - File reading, metadata packing/unpacking
3. **image-utils.ts** - Image loading, canvas operations, PNG export
4. **compression.ts** - Zlib compression using pako
5. **crypto.ts** - AES-256-GCM encryption with PBKDF2

---

## Destination Project Structure

### Current State:
- ✅ Has basic steganography components (TextInImage, AudioSteganography, VideoSteganography)
- ✅ Uses shadcn/ui components (compatible)
- ✅ Uses React Router (compatible)
- ✅ Has similar crypto utilities (different structure)
- ❌ Missing `pako` dependency for compression

### Integration Points:
- **Components**: `src/components/stego/`
- **Libraries**: `src/lib/stego/` (new subfolder to avoid conflicts)
- **Page**: New route `/steganography/file-image`

---

## File Mapping

### Library Files:
| Source | Destination | Notes |
|--------|-------------|-------|
| `src/lib/steganography.ts` | `src/lib/stego/steganography.ts` | Rename to avoid conflict |
| `src/lib/file-processor.ts` | `src/lib/stego/file-processor.ts` | New location |
| `src/lib/image-utils.ts` | `src/lib/stego/image-utils.ts` | New location |
| `src/lib/compression.ts` | `src/lib/stego/compression.ts` | New location |
| `src/lib/crypto.ts` | `src/lib/stego/crypto.ts` | Rename to avoid conflict with crypto-utils.ts |

### Component Files:
| Source | Destination | Notes |
|--------|-------------|-------|
| `src/components/EmbedPanel.tsx` | `src/components/stego/EmbedPanel.tsx` | Adapt imports |
| `src/components/ExtractPanel.tsx` | `src/components/stego/ExtractPanel.tsx` | Adapt imports |
| `src/components/DropZone.tsx` | `src/components/stego/DropZone.tsx` | Adapt imports |
| `src/components/FilePreview.tsx` | `src/components/stego/FilePreview.tsx` | Adapt imports |
| `src/components/PasswordInput.tsx` | `src/components/stego/PasswordInput.tsx` | Adapt imports |
| `src/components/CapacityIndicator.tsx` | `src/components/stego/CapacityIndicator.tsx` | Adapt imports |

### New Files:
- `src/components/stego/FileInImage.tsx` - Main page component combining EmbedPanel and ExtractPanel
- Update `src/pages/Steganography.tsx` - Add new tool card
- Update `src/App.tsx` - Add new route

---

## Import Path Changes Required

### Library Imports:
- `@/lib/steganography` → `@/lib/stego/steganography`
- `@/lib/file-processor` → `@/lib/stego/file-processor`
- `@/lib/image-utils` → `@/lib/stego/image-utils`
- `@/lib/compression` → `@/lib/stego/compression`
- `@/lib/crypto` → `@/lib/stego/crypto`

### Component Imports:
- `@/components/DropZone` → `@/components/stego/DropZone`
- `@/components/FilePreview` → `@/components/stego/FilePreview`
- `@/components/PasswordInput` → `@/components/stego/PasswordInput`
- `@/components/CapacityIndicator` → `@/components/stego/CapacityIndicator`

### UI Component Imports:
- Keep as `@/components/ui/*` (already compatible)

---

## Dependencies

### Required Addition:
- **pako** (^2.1.0) - For zlib compression/decompression
  - Currently missing in destination project
  - Must be added to `package.json`

### Already Available:
- All Radix UI components
- React Router DOM
- Lucide React icons
- Tailwind CSS
- TypeScript

---

## Integration Steps

### Step 1: Add Dependency
- Add `pako: "^2.1.0"` to `package.json` dependencies

### Step 2: Create Library Structure
- Create `src/lib/stego/` directory
- Copy and adapt all 5 library files
- Update internal imports within library files

### Step 3: Copy Components
- Copy all 6 component files to `src/components/stego/`
- Update all imports to match destination structure

### Step 4: Create Main Component
- Create `FileInImage.tsx` that combines EmbedPanel and ExtractPanel
- Use Tabs component for embed/extract modes

### Step 5: Update Routing
- Add route to `App.tsx`: `/steganography/file-image`
- Update `Steganography.tsx` page to include new tool card

### Step 6: Verify
- Check all imports resolve correctly
- Ensure no naming conflicts
- Test component rendering

---

## Potential Issues & Solutions

### Issue 1: Crypto Module Naming
- **Problem**: Source has `crypto.ts`, destination has `crypto-utils.ts`
- **Solution**: Place source crypto in `stego/crypto.ts` to avoid conflicts

### Issue 2: Utils Function
- **Problem**: Both projects use `cn()` from `@/lib/utils`
- **Solution**: Already compatible, no changes needed

### Issue 3: Toast System
- **Problem**: Both use `useToast` hook
- **Solution**: Already compatible, destination has same hook

---

## Testing Checklist

- [ ] All imports resolve correctly
- [ ] Components render without errors
- [ ] File upload works (drag & drop)
- [ ] Image embedding works
- [ ] File extraction works
- [ ] Password encryption/decryption works
- [ ] Capacity indicator displays correctly
- [ ] Route navigation works
- [ ] No console errors

---

## Notes

- The source project uses 2 LSBs per channel (RGB) for higher capacity
- Output is always PNG to preserve hidden data
- Supports any file type (not just text)
- Uses AES-256-GCM encryption with PBKDF2 key derivation
- Includes compression to maximize capacity

