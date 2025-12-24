/**
 * @file CustomCursor.jsx
 * @description:
 *   This component implements a fully customized SVG cursor that replaces
 *   the default system cursor. It tracks mouse movement, changes color when
 *   hovering over clickable elements, and provides visual feedback when the
 *   user is clicking.
 *
 * Features:
 *   - Real-time cursor tracking using mousemove events
 *   - Detects when hovering over elements with cursor: pointer
 *   - Changes cursor color based on interaction (normal, hover, clicking)
 *   - Renders a lightweight SVG cursor at the mouse position
 * 
 * @author Annalyn Hassell
 */
import React, { useEffect, useState } from "react";

export default function CustomCursor() {
    // Track the cursor's x and y position
    const [pos, setPos] = useState({ x: 0, y: 0 });
    // Whether the mouse button is currently pressed
    const [isClicking, setIsClicking] = useState(false);
    // Whether the cursor is hovering over an element that is clickable (cursor: pointer)
    const [isHoveringClickable, setIsHoveringClickable] = useState(false);

    /**
     * useEffect:
     * Sets up global event listeners for mouse movement, mouse down, and mouse up.
     * Cleans up the listeners when the component unmounts.
     */
    useEffect(() => {
        const move = (e) => {
            // Update mouse position on every mousemove
            setPos({ x: e.clientX, y: e.clientY });

            // Detect the element under the cursor
            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (!el) return;

            const style = window.getComputedStyle(el).cursor;

            // Mark as clickable only if style indicates pointer (links, buttons, etc.)
            setIsHoveringClickable(style === "pointer");
        };

        const down = () => setIsClicking(true);
        const up = () => setIsClicking(false);

        // Attach global listeners
        window.addEventListener("mousemove", move);
        window.addEventListener("mousedown", down);
        window.addEventListener("mouseup", up);

        // Cleanup → remove listeners when component unmounts
        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mousedown", down);
            window.removeEventListener("mouseup", up);
        };
    }, []);

    /**
     * Choose the cursor color based on interaction state:
     * - dark-grey when clicking
     * - blue when hovering over clickable elements
     * - yellow normally
     */
    const fillColor = isClicking
        ? "dark-grey"            // When mouse is pressed
        : isHoveringClickable
            ? "#007BFF"        // When hovering clickable elements
            : "yellow";          // Default cursor color

    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 48"
            style={{
                position: "fixed",
                top: pos.y,         // Y-position of cursor
                left: pos.x,        // X-position of cursor
                transform: "translate(-4px, -4px)",
                pointerEvents: "none",
                zIndex: 9999999,    // Ensures cursor appears above all elements
            }}
        >
            {/* SVG shape of the custom cursor */}
            <path
                d="M2 2 L2 44 L10 36 L18 48 L24 44 L16 32 L30 32 Z"
                fill={fillColor}
                stroke="black"
                strokeWidth="2"
            />
        </svg>
    );
}
