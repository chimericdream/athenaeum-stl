import { useCallback, useState } from 'react';

export default function useSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, [setIsOpen]);

    const openSidebar = useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);

    const closeSidebar = useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);

    return { closeSidebar, isOpen, openSidebar, toggle };
}
