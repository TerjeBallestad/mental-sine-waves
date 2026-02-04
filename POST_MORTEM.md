# Mental Sine Waves - Prototype Post-Mortem

## Overview

| Attribute | Value |
|-----------|-------|
| **Project Type** | Educational/therapeutic game prototype |
| **Tech Stack** | React 19.2, TypeScript 5.9, Vite 7.2, MobX 6.15, DaisyUI + Tailwind |
| **Purpose** | Gamify mental health through wave-based resonance mechanics |
| **Scope** | ~3,500 LOC, 15+ components, 1 MobX store, 4 prototype views |
| **Duration** | Dec 22, 2025 → Jan 19, 2026 (~4 weeks) |
| **Milestone** | v0.1 (Initial Prototype) |

**Core Thesis:** Character compatibility with activities can be modeled as mathematical sine wave resonance, creating emergent discovery-based learning rather than explicit stat comparisons. Players learn to understand different personality types through observation, not exposition.

---

## Feature Evaluation

### 1. Wave-Based Resonance System
**Description:** Models character traits as 3 harmonic sine waves (convergent, divergent, attention) that combine into a unique "mental rhythm". Activity compatibility is calculated by comparing character waves against activity ideal signatures, returning 0-1 resonance score.

**What Worked:**
- Ebb and flow output feels realistic vs flat RNG modifiers
- Proved wave-based mechanics create organic variation
- Good for resource generation purpose

**What Didn't Work:**
- Complexity overhead for what it delivers
- Would require major redesign to fit MTG color system
- Not essential to core loop

**Evaluation:** `📋 DEFER`

**Reasoning:** Valuable prototype validation - proved wave-based output feels more organic than RNG. However, final game will use simplified MTG color personalities, making this system redundant without major redesign. Keep code around; revisit if simpler system feels like it's missing depth.

---

### 2. Character Trait System
**Description:** 12 personality/cognitive traits (agreeableness, conscientiousness, extraversion, neuroticism, openness, attentionSpan, creativity, focus, fortitude, intellect, processingSpeed, workingMemory) that drive wave calculations and activity compatibility.

**What Worked:**
- Proved trait-driven compatibility is a viable core mechanic
- Provided enough dimensions to create distinct character feels

**What Didn't Work:**
- 12 traits is way too many - bloated and hard to balance
- Players can't intuit academic psychology terms
- Too much tuning surface area for the value delivered

**Evaluation:** `🔄 REDESIGN`

**Reasoning:** The concept of trait-driven compatibility is core to the game, but 12 dimensions is excessive. Collapse to MTG color system (5 colors) - immediately graspable by players and maps naturally to personality archetypes.

---

### 3. Character State System
**Description:** 12 dynamic resources per character (energy, mentalCapacity, attention, will, security, overskudd, workingMemory, socialBattery, flow, nutrition, purpose, mood) intended to fluctuate during gameplay.

**What Worked:**
- Concept of fluctuating mental state is thematically on-point for mental health game
- Some resources are interesting and worth keeping in some form
- Provides simulation depth for emergent behavior

**What Didn't Work:**
- 12 visible resources is too much cognitive load for players
- Most were static/decorative - never actually wired up
- Players don't need to manage all of these directly

**Evaluation:** `🔄 REDESIGN`

**Reasoning:** Split into two tiers: (1) Player-visible resources they actively manage (overskudd, maybe 1-2 others), and (2) Hidden simulation variables that affect AI/character behavior as "spice" without requiring player attention. Reduces cognitive load while preserving emergent depth.

---

### 4. Four Character Archetypes
**Description:** Elling (anxious creative), Kjell-Bjarne (steady reliable), Test Dummy (balanced), Nora (dynamic adaptable) - each with distinct trait distributions creating different resonance patterns.

**What Worked:**
- Hand-crafted characters with distinct personalities create attachment
- Archetypes cover good design space (anxious introvert, steady worker, dynamic adapter)
- Elling IP could be valuable for Norwegian market funding/promotion (NFI)
- Characters that persist across runs adds recognition and replayability

**What Didn't Work:**
- Test Dummy is clearly debug-only, not a real character
- Specific Elling film reference may not translate globally

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Hand-crafted recurring characters is core to the vision. The specific Elling/Kjell-Bjarne IP is a business decision - could pursue NFI funding and Norwegian market positioning ("the Elling game") while having flexibility for global version. A few thousand Norwegian sales beats zero sales.

---

### 5. Activity System
**Description:** 5 core activities (Research, Outreach, Creative Problem-Solving, Mindfulness, Dummy Task) with mental signatures, interest bonuses, difficulty ratings, required/recommended skills, and reward definitions.

**What Worked:**
- Core concept of activities with personality-based compatibility
- Interest bonuses add meaningful variation
- Tick-based reward generation (rewardInterval) creates pacing
- Some structural elements worth keeping

**What Didn't Work:**
- Constructor bug (required/recommended skills swapped)
- `lol` parameter was experimental cruft
- Structure has already been improved in newer prototype
- Only 5 activities too light (though fine for prototype)

**Evaluation:** `🔄 REDESIGN`

**Reasoning:** Activity system architecture proved the concept works. Merge learnings from this prototype with the improved structure from newer prototype. Fix the bug, remove experimental parameters, adapt to MTG color system.

---

### 6. Skill Tree System
**Description:** 42 skills in 4 Piaget-based cognitive tiers (Preoperational, Concrete Operational, Formal Operational, Post-Formal). Tree structure with prerequisites and 0-10 level progression with exponential XP thresholds.

**What Worked:**
- Tiered skill progression concept is sound
- Skills leveling through activities is core to the game's thesis
- XP threshold escalation creates meaningful progression

**What Didn't Work:**
- 42 skills is far too many
- Abstract Piaget cognitive skills miss the point entirely
- Players don't relate to "Categorization" or "Logic"
- Skills never actually leveled from gameplay

**Evaluation:** `🔄 REDESIGN`

**Reasoning:** Skills ARE the core of the game - Elling learning everyday life skills to reintegrate into society. Redesign around concrete, relatable skills: "Cooking", "Small talk", "Paying bills", "Public transport". Reference Stardew Valley (do thing → level thing) and Punch Club for skill systems that tell story through progression. Cut to 10-15 max skills that directly map to Elling's journey.

---

### 7. Resource Generation System
**Description:** 40+ resource types (experience, knowledge, social, creative, practical categories) generated from activities with probability weighting and resonance-based amount modulation.

**What Worked:**
- Satisfying number-go-up is a valid design goal
- Multiple resource types creates variety in what drops
- Probability weighting adds organic variation

**What Didn't Work:**
- 40+ resources is way too many
- Resources don't *do* anything - no spending, no conversion
- System designed for economy sim, not cozy incremental
- Money-centric thinking doesn't fit Elling's story (his value is poems, not paycheck)

**Evaluation:** `🔄 REDESIGN`

**Reasoning:** Shift to cozy/incremental framing: resources as physical objects that drop and player clicks to collect. Reduce to 3-5 resource types representing types of value created (Creativity, Connection, Stability, Confidence) rather than economic commodities. Money exists within Stability but isn't the center. Design for satisfying collection, not economic optimization.

---

### 8. Talent System
**Description:** 13 talents in 5 trees (Mental Focus, Cognitive Flexibility, Resilience, Social Intelligence, Analytical) with max 5 points each, providing trait modifiers, resonance bonuses, or resource multipliers.

**What Worked:**
- Concept of milestone rewards is appealing
- Player choice (pick 1 of 3) is proven satisfying design
- Could add strategic depth and replayability

**What Didn't Work:**
- Never integrated - completely dead code
- Player-allocated talent points don't fit pre-made characters
- Tree structure adds complexity without clear benefit
- Requires significant design time to do well

**Evaluation:** `📋 DEFER`

**Reasoning:** Nice to have, not essential. If implemented, shift to automatic milestone rewards with roguelike "pick 1 of 3 upgrades" rather than player-allocated points. But this is extra scope that doesn't touch core loop - add later if there's time and the game needs more depth.

---

### 9. Overskudd Regeneration System
**Description:** Complex regeneration formula: base 2.0/hr modified by nutrition (±50%), energy (±30%), time-of-day (0.8x-1.5x), resting bonus (2x), with minimum floor of 0.1/hr. Anxiety drain when security < 50.

**What Worked:**
- "Overskudd" (surplus capacity) is perfect thematic fit for mental health game
- The concept of regeneration affected by life factors is real and relatable
- Math visualization in prototype was good for debugging/understanding

**What Didn't Work:**
- Multi-variable formula is over-engineered for cozy incremental
- Never actually implemented - just displayed
- Players don't want to manage nutrition → overskudd → activity

**Evaluation:** `⚠️ SIMPLIFY`

**Reasoning:** Keep overskudd as core "action capacity" resource - it's thematically perfect. Start with simple regeneration (rest = recover) and add complexity only if gameplay demands it. The detailed formula can be revisited later if the simple version feels flat.

---

### 10. Wave Visualization UI
**Description:** SVG-based wave rendering (SvgWave, WaveCard) showing character's mental rhythm as animated polylines. 400-point resolution with optional dashing and multiple wave overlay.

**What Worked:**
- Clean SVG implementation
- Visually appealing representation of the math
- Good for developer debugging/understanding

**What Didn't Work:**
- Tied to resonance system which is deferred
- No clear player-facing purpose
- Developer tooling, not gameplay feature

**Evaluation:** `❌ CUT`

**Reasoning:** Wave visualization was debug/educational tooling for the resonance system. With resonance deferred, the wave UI serves no purpose. Not worth carrying forward.

---

### 11. Multi-Prototype Architecture
**Description:** 4 parallel prototype views (CharacterTalents, ResonanceSystem, ResourceSystem, OverskuddSystemet) plus PatientResourcePrototype - each exploring different mechanics while sharing core data.

**What Worked:**
- Useful for parallel exploration during prototyping
- Shared data layer meant experiments stayed consistent
- Good development practice for validating multiple directions

**What Didn't Work:**
- Not suitable for shipping product - players need one coherent experience
- Multiple views created confusion about "what is the game"
- Scaffolding, not product

**Evaluation:** `❌ CUT`

**Reasoning:** Multi-prototype approach was valuable for development - keep this workflow for engine-side testing. But ship a single unified view. The architecture served its purpose; delete the scaffold, keep the learnings.

---

### 12. Reward Stream Display
**Description:** Real-time display of generated rewards with color-coding by resonance quality (green > 65%, yellow 45-65%, red < 45%) and fading opacity for older rewards.

**What Worked:**
- Proved concept of visible reward feedback
- Fading stream UX showed timing/pacing of rewards

**What Didn't Work:**
- Debug/placeholder implementation, not meant for shipping
- Text-based stream doesn't match cozy incremental vision
- Tied to resonance color-coding which is being deferred

**Evaluation:** `❌ CUT`

**Reasoning:** Debug placeholder for final implementation. The real version will be visual collectible drops (floating icons players click to collect), not a text stream. This served its prototyping purpose.

---

### 13. Time Simulation System
**Description:** Game loop with 0.05 in-game hours (3 min) timesteps at 100ms real intervals. Start/pause control, day/hour calculation, multiple concurrent views.

**What Worked:**
- Time controls (start/pause) are essential
- Continuous time → day/hour derivation is clean
- Core infrastructure that everything else depends on

**What Didn't Work:**
- Specific timescale (30 in-game min per second) needs tuning
- No offline progress (things happening while away)

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Time simulation is fundamental infrastructure for any incremental game. Start/pause controls are essential. Timescale will need tuning in final version to feel right. Active play only - no offline progress (game doesn't progress while away).

---

### 14. Hidden Information Design
**Description:** Intentionally hide stats from players - traits and resonance math not shown in main view. Players discover compatibility through experimentation, not stat comparison.

**What Worked:**
- Philosophy of discovery through play vs spreadsheet optimization is appealing
- Fits cozy game feel - learn patterns, don't min-max
- Opens interesting design space (e.g., therapist unlocks visibility of purpose stat)

**What Didn't Work:**
- Can't finalize until character stats are redesigned
- Risk of player frustration if feedback is too opaque

**Evaluation:** `📋 DEFER`

**Reasoning:** Needs more exploration once stat system is redesigned. Interesting idea: progressive reveal through gameplay (hire therapist → see purpose stat). Nice-to-have feature that depends on other systems being finalized first.

---

## Features NOT Implemented (But Designed)

### A. Talent Integration
**Description:** Talent system fully defined (13 talents, effects, costs) but never instantiated or applied to character traits.

**Status:** Complete data model, no integration code

**Evaluation:** `📋 DEFER`

---

### B. Skill XP Progression System
**Description:** Experience resources generated but don't automatically grant skill XP. No conversion system from analyticalExperience to skill levels.

**Status:** Manual +/- buttons for testing only

**Evaluation:** `🔄 REDESIGN`

**Reasoning:** Redesign to fungible XP system like Punch Club - single XP pool player allocates to skills, rather than auto-conversion from activity-specific experience resources.

---

### C. Activity Cost System
**Description:** Overskudd intended as activity cost but never deducted. Character state (energy, attention) designed to deplete but static.

**Status:** Display only, no cost logic

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Core to gameplay - activities must cost overskudd to create resource management decisions.

---

### D. Will/Motivation Gate
**Description:** `will` property designed to gate non-habit actions. Intended to make difficult choices costly.

**Status:** Property exists, never modified or checked

**Evaluation:** `📋 DEFER`

**Reasoning:** Extra complexity layer. Add later if simple overskudd cost isn't providing enough decision depth.

---

### E. Flow State Mechanics
**Description:** `flow` property tracks state, designed to boost skill gains during sustained focused activity.

**Status:** Property exists, never updated or applied

**Evaluation:** `📋 DEFER`

**Reasoning:** Nice-to-have bonus system. Not essential for core loop, can add depth later.

---

### F. Skill Requirement Enforcement
**Description:** Activities have requiredSkills but checking incomplete. Players can attempt any activity regardless of skills.

**Status:** Data exists, no enforcement logic (also has bug: required/recommended swapped in constructor)

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Progression gates are essential - skills unlocking activities creates meaningful goals and pacing.

---

### G. Everyday Situations
**Description:** Humorous character interaction events demonstrating personality through actions ("Show don't tell"). Elling hiding behind car during small talk, etc.

**Status:** Comments/design only, never rendered

**Evaluation:** `📋 DEFER`

**Reasoning:** Charming flavor that demonstrates character personality, but not core loop. Add after main systems work.

---

### H. Multi-Character Management
**Description:** Manage 2+ characters with different personalities, per-character resources, coordinating their activities.

**Status:** PatientResourcePrototype explored this direction

**Evaluation:** `✅ INCLUDE`

**Reasoning:** Core to final game vision - even demo will have 2 characters. Multi-character management is the game, not a tangent.

---

## Summary Table

| # | Feature | Implemented | Evaluation |
|---|---------|-------------|------------|
| 1 | Wave-Based Resonance System | Yes | `📋 DEFER` |
| 2 | Character Trait System | Yes | `🔄 REDESIGN` |
| 3 | Character State System | Yes | `🔄 REDESIGN` |
| 4 | Four Character Archetypes | Yes | `✅ INCLUDE` |
| 5 | Activity System | Yes | `🔄 REDESIGN` |
| 6 | Skill Tree System | Yes | `🔄 REDESIGN` |
| 7 | Resource Generation System | Yes | `🔄 REDESIGN` |
| 8 | Talent System | Partial | `📋 DEFER` |
| 9 | Overskudd Regeneration System | Partial | `⚠️ SIMPLIFY` |
| 10 | Wave Visualization UI | Yes | `❌ CUT` |
| 11 | Multi-Prototype Architecture | Yes | `❌ CUT` |
| 12 | Reward Stream Display | Yes | `❌ CUT` |
| 13 | Time Simulation System | Yes | `✅ INCLUDE` |
| 14 | Hidden Information Design | Yes | `📋 DEFER` |
| A | Talent Integration | No | `📋 DEFER` |
| B | Skill XP Progression | No | `🔄 REDESIGN` |
| C | Activity Cost System | No | `✅ INCLUDE` |
| D | Will/Motivation Gate | No | `📋 DEFER` |
| E | Flow State Mechanics | No | `📋 DEFER` |
| F | Skill Requirement Enforcement | No | `✅ INCLUDE` |
| G | Everyday Situations | No | `📋 DEFER` |
| H | Multi-Character Management | Partial | `✅ INCLUDE` |

## Key Decisions Captured

1. **Game Direction**: Cozy incremental with clickable resource drops, not heavy simulation
2. **Personality System**: MTG colors (5) instead of 12 academic traits
3. **Skills**: Concrete everyday skills (Cooking, Small talk, Public transport) not abstract Piaget tiers
4. **Resources**: 3-5 value types (Creativity, Connection, Stability, Confidence) not 40+ commodities
5. **XP System**: Fungible XP pool (Punch Club style) player allocates to skills
6. **Core Loop**: Multi-character management, activities cost overskudd, skills unlock activities
7. **Business**: Elling IP as potential NFI funding lever for Norwegian market
8. **Time**: Active play only, no offline progress

## Summary Counts

| Evaluation | Count |
|------------|-------|
| INCLUDE | 5 |
| SIMPLIFY | 1 |
| REDESIGN | 6 |
| CUT | 3 |
| DEFER | 7 |
| **Evaluated** | 22 |
| **Remaining** | 0 |

---

*Prototype developed: Dec 22, 2025 → Jan 19, 2026*
*Post-mortem completed: 2026-02-04*
