import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export function useSwipe(element: Ref<HTMLElement | null>, onSwipeLeft?: () => void, onSwipeRight?: () => void) {
  const startX = ref(0);
  const startY = ref(0);
  const currentX = ref(0);
  const currentY = ref(0);
  const isDragging = ref(false);

  const handleTouchStart = (e: TouchEvent) => {
    startX.value = e.touches[0].clientX;
    startY.value = e.touches[0].clientY;
    isDragging.value = true;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.value) return;
    
    currentX.value = e.touches[0].clientX;
    currentY.value = e.touches[0].clientY;
    
    const deltaX = currentX.value - startX.value;
    const deltaY = currentY.value - startY.value;
    
    if (element.value) {
      element.value.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
      
      if (deltaX > 50) {
        element.value.style.borderColor = '#10B981';
      } else if (deltaX < -50) {
        element.value.style.borderColor = '#EF4444';
      } else {
        element.value.style.borderColor = 'transparent';
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.value) return;
    
    const deltaX = currentX.value - startX.value;
    const threshold = 100;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }
    
    if (element.value) {
      element.value.style.transform = '';
      element.value.style.borderColor = 'transparent';
    }
    
    isDragging.value = false;
  };

  const handleMouseDown = (e: MouseEvent) => {
    startX.value = e.clientX;
    startY.value = e.clientY;
    isDragging.value = true;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return;
    
    currentX.value = e.clientX;
    currentY.value = e.clientY;
    
    const deltaX = currentX.value - startX.value;
    
    if (element.value) {
      element.value.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
      
      if (deltaX > 50) {
        element.value.style.borderColor = '#10B981';
      } else if (deltaX < -50) {
        element.value.style.borderColor = '#EF4444';
      } else {
        element.value.style.borderColor = 'transparent';
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDragging.value) return;
    
    const deltaX = currentX.value - startX.value;
    const threshold = 100;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }
    
    if (element.value) {
      element.value.style.transform = '';
      element.value.style.borderColor = 'transparent';
    }
    
    isDragging.value = false;
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  onMounted(() => {
    if (element.value) {
      element.value.addEventListener('touchstart', handleTouchStart);
      element.value.addEventListener('touchmove', handleTouchMove);
      element.value.addEventListener('touchend', handleTouchEnd);
      element.value.addEventListener('mousedown', handleMouseDown);
    }
  });

  onUnmounted(() => {
    if (element.value) {
      element.value.removeEventListener('touchstart', handleTouchStart);
      element.value.removeEventListener('touchmove', handleTouchMove);
      element.value.removeEventListener('touchend', handleTouchEnd);
      element.value.removeEventListener('mousedown', handleMouseDown);
    }
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  });

  return {
    isDragging
  };
}