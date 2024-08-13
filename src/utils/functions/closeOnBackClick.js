export const closeOnBackClick = (state = false, ref, onClose = Function) => {
    const handleClose = e => {
        if (state === true && ref.current && !ref.current.contains(e.target)) {
            onClose()
        }
    }
    document.addEventListener('click', handleClose)
    return () => document.removeEventListener('click', handleClose)
}