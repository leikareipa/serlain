/*
 * 2020 Tarpeeksi Hyvae Soft
 *
 * Software: Mesh preview
 * 
 */

"use strict";

// A list of the elements we've made draggable.
const draggableElements = [];

// Enables dragging the given element via mouse.
//
// Will append "dragging" to the element's class list while the element is being dragged
// by the user.
//
// NOTE: The element must have a child of the "dragger" class. This child is the recipient
// of mouse input for dragging.
//
// NOTE: Assumes that the draggable surface spans the entire window.
//
export function make_element_draggable(targetElement)
{
    if (draggableElements.includes(targetElement))
    {
        return;
    }
    else
    {
        draggableElements.push(targetElement);
    }
    
    const draggerElement = targetElement.querySelector(".dragger");

    if (!draggerElement)
    {
        throw new Error("The draggee is missing a required .dragger child element.");
    }

    const dragStatus = {
        windowSize: {
            x: 0,
            y: 0,
        },
        mousePosition: {
            x: 0,
            y: 0,
        },
        dragPosition: {
            x: 0,
            y: 0,
        },
        isDragging: false,
        isInitialized: false,
    };

    draggerElement.addEventListener("mousedown", function(event)
    {
        if (event.button !== 0)
        {
            return;
        }

        if (!dragStatus.isInitialized)
        {
            initialize_dragging();
        }

        dragStatus.mousePosition.x = event.clientX;
        dragStatus.mousePosition.y = event.clientY;

        dragStatus.isDragging = true;
        targetElement.classList.add("dragging");

        return;
    });

    window.addEventListener("resize", function(event)
    {
        if (!dragStatus.isInitialized)
        {
            return;
        }

        const mulX = (window.innerWidth / dragStatus.windowSize.x);
        const mulY = (window.innerHeight / dragStatus.windowSize.y);

        dragStatus.windowSize.x = window.innerWidth;
        dragStatus.windowSize.y = window.innerHeight;

        dragStatus.dragPosition.x *= mulX;
        dragStatus.dragPosition.y *= mulY;
        update_element_position(clip_element_to_edges());

        return;
    });

    window.addEventListener("mouseup", function(event)
    {
        if (event.button !== 0)
        {
            return;
        }

        if (dragStatus.isDragging)
        {
            dragStatus.isDragging = false;
            targetElement.classList.remove("dragging");

            update_element_position(clip_element_to_edges());
        }

        return;
    });

    window.addEventListener("mousemove", function(event)
    {
        if (dragStatus.isDragging)
        {
            dragStatus.dragPosition.x += (event.clientX - dragStatus.mousePosition.x);
            dragStatus.dragPosition.y += (event.clientY - dragStatus.mousePosition.y);

            update_element_position();
        }

        dragStatus.mousePosition.x = event.clientX;
        dragStatus.mousePosition.y = event.clientY;

        return;
    });

    // If the dragged element's position is partially or fully outside of the screen's
    // edges, move it so that it's fully inside. Returns true if we moved the position,
    // false otherwise (i.e. when the element is already fully inside the screen).
    function clip_element_to_edges()
    {
        const marginLeft = 0;
        const marginRight = 0;
        const marginTop = 0;
        const marginBottom = 32;

        const maxX = (window.innerWidth - targetElement.clientWidth - marginRight);
        const maxY = (window.innerHeight - targetElement.clientHeight - marginBottom);

        const clippedPosition = {
            x: Math.max(marginLeft, Math.min(maxX, dragStatus.dragPosition.x)),
            y: Math.max(marginTop, Math.min(maxY, dragStatus.dragPosition.y)),
        };

        // If the element isn't fully inside the screen.
        if ((dragStatus.dragPosition.x != clippedPosition.x) ||
            (dragStatus.dragPosition.y != clippedPosition.y))
        {
            dragStatus.dragPosition.x = clippedPosition.x;
            dragStatus.dragPosition.y = clippedPosition.y;

            return true;
        }

        return false;
    }

    function update_element_position(automaticMove = false)
    {
        if (automaticMove)
        {
            targetElement.animate([
                {left: targetElement.style.left,
                 top: targetElement.style.top},
                {left: `${dragStatus.dragPosition.x}px`,
                 top: `${dragStatus.dragPosition.y}px`},
            ], {duration:200, easing:"ease-in-out"});
        }

        targetElement.style.top = `${dragStatus.dragPosition.y}px`;
        targetElement.style.left = `${dragStatus.dragPosition.x}px`;

        return;
    }

    function initialize_dragging()
    {
        if (!targetElement)
        {
            throw new Error("Unknown target element.");
        }

        dragStatus.dragPosition.x = targetElement.getBoundingClientRect().left;
        dragStatus.dragPosition.y = targetElement.getBoundingClientRect().top;

        dragStatus.windowSize.x = window.innerWidth;
        dragStatus.windowSize.y = window.innerHeight;

        update_element_position(false);
        targetElement.style.right = "";
        targetElement.style.bottom = "";
        targetElement.style.transform = "none";

        dragStatus.isInitialized = true;
        
        return;
    }
}
