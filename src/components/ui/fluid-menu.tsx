import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

interface MenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
  showChevron?: boolean
}

export function Menu({ trigger, children, align = "left", showChevron = true }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block text-left">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer inline-flex items-center"
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
        {showChevron && (
          <ChevronDown className="ml-2 -mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute ${align === "right" ? "right-0" : "left-0"
            } mt-2 w-56 rounded-md bg-[#0f0c12]/95 border border-white/10 shadow-lg ring-1 ring-black ring-opacity-9 focus:outline-none z-50`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface MenuItemProps {
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  icon?: React.ReactNode
  isActive?: boolean
}

export function MenuItem({ children, onClick, disabled = false, icon, isActive = false }: MenuItemProps) {
  return (
    <button
      className={`relative block w-full text-center group cursor-pointer transition-colors duration-200 outline-none
        ${disabled ? "text-gray-500 cursor-not-allowed" : "text-[#eae5ec]/80 hover:text-white"}
        ${isActive ? "bg-white/10" : ""}
      `}
      style={{ height: '64px' }}
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="flex items-center justify-center" style={{ height: '100%' }}>
        {icon && (
          <span className="text-[#c2a4ff] flex items-center justify-center transition-all duration-200 group-hover:[&_svg]:stroke-[2.5]" style={{ width: '24px', height: '24px' }}>
            {icon}
          </span>
        )}
        {children}
      </span>
    </button>
  )
}

interface MenuContainerProps {
  children: React.ReactNode
  isExpandedExternal?: boolean
  setIsExpandedExternal?: (expanded: boolean) => void
}

export function MenuContainer({ children, isExpandedExternal, setIsExpandedExternal }: MenuContainerProps) {
  const [isExpandedLocal, setIsExpandedLocal] = useState(false)
  const isExpanded = isExpandedExternal !== undefined ? isExpandedExternal : isExpandedLocal
  const setIsExpanded = setIsExpandedExternal !== undefined ? setIsExpandedExternal : setIsExpandedLocal

  const childrenArray = React.Children.toArray(children)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="relative" style={{ width: '64px' }} data-expanded={isExpanded}>
      {/* Container for all items */}
      <div className="relative">
        {/* First item - always visible */}
        <div
          className="relative flex items-center justify-center cursor-pointer rounded-full group will-change-transform z-50 shadow-2xl transition-all duration-300"
          style={{ width: '64px', height: '64px', backgroundColor: 'rgba(15,12,18,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}
          onClick={handleToggle}
        >
          {childrenArray[0]}
        </div>

        {/* Other items */}
        {childrenArray.slice(1).map((child, index) => (
          <div
            key={index}
            className="absolute top-0 left-0 flex items-center justify-center rounded-full will-change-transform shadow-xl transition-all duration-200"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(15,12,18,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              transform: `translateY(${isExpanded ? (index + 1) * 48 : 0}px)`,
              opacity: isExpanded ? 1 : 0,
              zIndex: 40 - index,
              clipPath: index === childrenArray.length - 2
                ? "circle(50% at 50% 50%)"
                : "circle(50% at 50% 55%)",
              transition: `transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${isExpanded ? '300ms' : '350ms'}`,
              backfaceVisibility: 'hidden',
              WebkitFontSmoothing: 'antialiased'
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
