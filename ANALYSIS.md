# Cartier Gallery - Deep Analysis & Iteration Plan

## Reference Site Study: https://cartier-waw-0225.dev.60fps.fr/

### Architecture Details
1. **Curved, Organic Walls** - Cartier uses beautifully curved walls (not flat planes)
   - Soft, rounded edges throughout
   - Walls appear to curve gently, creating intimate spaces
   - No hard 90° corners visible

2. **Arched Doorways** - Signature element
   - Large, prominent rounded arches
   - Soft edges with subtle depth
   - Glow/highlight on arch edges
   - Multiple arches creating depth perspective

3. **Room Shape** - Organic, flowing spaces
   - Rounded corners instead of sharp edges
   - Curved ceiling transitions
   - Everything feels "molded" rather than "built"

### Lighting Analysis
1. **Soft, Diffused Quality**
   - Warm peachy-beige color (#C9A88A approximate)
   - No harsh shadows
   - Appears to use ambient occlusion
   - Subtle directional highlights

2. **Color Temperature**
   - Warm, inviting palette
   - Peachy-beige base
   - Subtle variations in wall/floor colors
   - Very minimal contrast

3. **Possible Techniques**
   - Ambient light + soft directional
   - May use HDRI environment map
   - Post-processing bloom for glow
   - Vignette for focus

### Materials & Surfaces
1. **Matte Finish** - Low reflectivity
2. **Subtle Color Variations** - Walls slightly different from floor
3. **Soft Shading** - No hard edges in lighting
4. **Organic Feel** - Everything appears smooth, hand-crafted

### Particles
1. **Visible dust motes** throughout
2. **Size** - Larger than typical, easily visible
3. **Movement** - Slow, floating motion
4. **Color** - Warm white/cream
5. **Glow** - Subtle luminosity

### Camera Movement
1. **Smooth easing** - Very polished interpolation
2. **Forward motion** - Moving through doorways
3. **Subtle sway** - Minimal lateral movement
4. **Height variation** - Slight bobbing effect
5. **Look-ahead** - Camera may be looking slightly forward

### Typography
1. **Large serif font** - White color
2. **Overlaid on 3D scene** - Z-index layering
3. **Elegant spacing** - Letter-spacing and line-height
4. **Fade animations** - Smooth appearance

### Performance
1. **Smooth 60fps** - Well optimized
2. **Progressive loading** - Assets load gracefully
3. **Level of Detail** - May use LOD for distant objects

---

## Current Implementation Gaps

### CRITICAL (High Impact):
1. ❌ **Flat walls instead of curved** - Biggest visual difference
2. ❌ **Missing post-processing** - No bloom, advanced effects
3. ❌ **Cylindrical pillars** - Should be organic/curved elements
4. ⚠️ **Arch design** - Basic but could be more refined
5. ⚠️ **Particle visibility** - May need to be larger/more prominent

### IMPORTANT (Medium Impact):
6. ⚠️ **Color calibration** - Close but may need fine-tuning
7. ⚠️ **Camera easing** - Using GSAP but could be smoother
8. ⚠️ **Lighting softness** - Could be more diffused
9. ❌ **Material shaders** - Missing subtle complexity

### NICE TO HAVE (Lower Impact):
10. ❌ **Reflective floor** - Subtle mirror effect
11. ❌ **Light shafts/rays** - Volumetric lighting
12. ❌ **3D text** - Typography as geometry
13. ❌ **Sound design** - Audio atmosphere

---

## Iteration Plan (Prioritized)

### Iteration 1: Curved Organic Architecture ⭐⭐⭐
**Impact: CRITICAL**
- Replace flat wall planes with curved geometry
- Use CylinderGeometry or custom curve extrusion
- Create rounded room corners
- Soften all edges

### Iteration 2: Post-Processing Pipeline ⭐⭐⭐
**Impact: CRITICAL**
- Add EffectComposer
- UnrealBloomPass for soft glow
- Vignette effect
- Color grading

### Iteration 3: Enhanced Arches ⭐⭐
**Impact: HIGH**
- Make arches more prominent
- Add subtle glow/rim light
- Increase depth and scale
- Refine curves

### Iteration 4: Particle Enhancement ⭐⭐
**Impact: HIGH**
- Increase particle size (2-3x)
- Add subtle glow to particles
- Adjust density and distribution
- Fine-tune movement physics

### Iteration 5: Advanced Materials ⭐⭐
**Impact: MEDIUM**
- Add custom shaders for walls
- Subtle normal mapping
- Enhanced material properties
- Color variation across surfaces

### Iteration 6: Camera Refinement ⭐
**Impact: MEDIUM**
- Implement custom easing curve
- Add look-ahead targeting
- Refine movement speed
- Test different interpolation methods

### Iteration 7: Lighting Polish ⭐
**Impact: MEDIUM**
- Add more fill lights
- Adjust shadow softness
- Fine-tune colors and intensities
- Possible HDRI environment

### Iteration 8: Final Details ⭐
**Impact: LOW-MEDIUM**
- Floor reflections
- Light shafts (if performance allows)
- Additional decorative elements
- Micro-interactions

---

## Success Metrics

### Visual Parity (1-10 scale):
- Architecture: Currently 4/10 → Target 9/10
- Lighting: Currently 6/10 → Target 9/10
- Materials: Currently 6/10 → Target 8/10
- Particles: Currently 5/10 → Target 9/10
- Camera: Currently 7/10 → Target 9/10
- Overall: Currently 5/10 → Target 9/10

### Performance Targets:
- 60 FPS on desktop ✅
- 30+ FPS on mobile
- Load time < 3 seconds

---

## Technical Resources Needed

1. **EffectComposer** - `three/examples/jsm/postprocessing/EffectComposer`
2. **UnrealBloomPass** - `three/examples/jsm/postprocessing/UnrealBloomPass`
3. **RenderPass** - `three/examples/jsm/postprocessing/RenderPass`
4. **ShaderPass** - For custom effects
5. **Custom shaders** - GLSL for advanced materials

---

## Notes
- Reference site appears to be a professional production (60fps team)
- May have custom engine/tools not available in standard Three.js
- Some effects may require compromises for performance
- Focus on the "feeling" rather than pixel-perfect replication
