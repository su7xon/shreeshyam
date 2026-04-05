'use client';

import { useState, useEffect } from 'react';
import SizeGuideModal from './SizeGuideModal';
import TradeInModal from './TradeInModal';
import BundleModal from './BundleModal';
import ARViewModal from './ARViewModal';
import OrderTrackingModal from './OrderTrackingModal';
import PremiumMembershipModal from './PremiumMembershipModal';
import InstallationServiceModal from './InstallationServiceModal';

export default function ModalManager() {
  const [mounted, setMounted] = useState(false);
  const [modals, setModals] = useState({
    sizeGuide: false,
    tradeIn: false,
    bundle: false,
    arView: false,
    orderTracking: false,
    premiumMembership: false,
    installationService: false,
  });

  useEffect(() => {
    setMounted(true);
    
    const handleOpenModal = (e: CustomEvent) => {
      const { modal } = e.detail;
      if (modal && modal in modals) {
        setModals(prev => ({ ...prev, [modal]: true }));
      }
    };
    
    window.addEventListener('openModal', handleOpenModal as EventListener);
    return () => window.removeEventListener('openModal', handleOpenModal as EventListener);
  }, []);

  const closeModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  if (!mounted) return null;

  return (
    <>
      <SizeGuideModal isOpen={modals.sizeGuide} onClose={() => closeModal('sizeGuide')} />
      <TradeInModal isOpen={modals.tradeIn} onClose={() => closeModal('tradeIn')} />
      <BundleModal isOpen={modals.bundle} onClose={() => closeModal('bundle')} />
      <ARViewModal isOpen={modals.arView} onClose={() => closeModal('arView')} />
      <OrderTrackingModal isOpen={modals.orderTracking} onClose={() => closeModal('orderTracking')} />
      <PremiumMembershipModal isOpen={modals.premiumMembership} onClose={() => closeModal('premiumMembership')} />
      <InstallationServiceModal isOpen={modals.installationService} onClose={() => closeModal('installationService')} />
    </>
  );
}

export function openModal(modalName: string) {
  window.dispatchEvent(new CustomEvent('openModal', { detail: { modal: modalName } }));
}