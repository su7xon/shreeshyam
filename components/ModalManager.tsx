'use client';

// ModalManager kept minimal — all fake modals removed
// Only the openModal utility is preserved for future real modals

import { useState, useEffect } from 'react';

export default function ModalManager() {
  return null;
}

export function openModal(modalName: string) {
  window.dispatchEvent(new CustomEvent('openModal', { detail: { modal: modalName } }));
}