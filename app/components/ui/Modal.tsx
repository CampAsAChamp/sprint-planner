'use client'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  titleSize?: string
  titleCentered?: boolean
}

export default function Modal({ isOpen, onClose, title, children, titleSize = "text-2xl", titleCentered = false }: ModalProps) {
  if (!isOpen) return null;

  const titleClasses = `${titleSize} font-semibold text-gray-900 dark:text-white mb-6 ${titleCentered ? 'text-center' : ''}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-lg w-full mx-4 animate-in zoom-in-95 duration-300">
        <h3 className={titleClasses}>
          {title}
        </h3>
        {children}
      </div>
    </div>
  )
}
