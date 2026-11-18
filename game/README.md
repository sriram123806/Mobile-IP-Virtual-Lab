# Packet Dash – A Mobile IP Tunneling Adventure
A beginner-friendly running game for the DCN Virtual Lab (Home Agent / Foreign Agent tunneling).

**Play:** double-click `index.html` (no install, no backend).

**Start:** an intro screen offers GET STARTED and HOW TO PLAY.

**Controls:** ← → move · Space jump · P pause · M mute. On phones use the on-screen buttons.

**Stages:** 1 Packet Journey → 2 Home Agent (encapsulation) → 3 Tunnel Adventure → 4 Foreign Agent (decapsulation) → 5 Delivery.
**Lives:** you start with 3 ♥. A pink spike costs 1 life (plus 5 points) and slows the packet for about 3 seconds, after which speed recovers smoothly. A short cooldown stops one spike costing several lives. Lose all 3 and the Game Over panel offers a Restart.

**Encapsulation / decapsulation:** after the Home Agent, a transparent green "OUTER IP" box wraps the blue packet for the whole HA → FA tunnel. After the Foreign Agent explanation, the box appears once more and dissolves in a burst, leaving the original packet.

Files: `index.html`, `style.css`, `game.js`, `assets/icon.svg`.
