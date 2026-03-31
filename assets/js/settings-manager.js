(function () {
    function createSettingsManager(config) {
        const {
            appStorage,
            modalManager,
            elements = {},
            featureControls = {},
            floatingControls = {},
            callbacks = {},
            state = {}
        } = config || {};

        function updateStorageInfo() {
            const storageData = callbacks.getStorageData?.();
            if (!storageData || !elements.storageUsedDisplay || !elements.storageBar) return;
            const dataStr = JSON.stringify(storageData);
            const bytes = new Blob([dataStr]).size;
            const kb = (bytes / 1024).toFixed(2);
            const maxKb = 5120;
            const percentage = Math.min((bytes / (maxKb * 1024)) * 100, 100);
            elements.storageUsedDisplay.textContent = `${kb} KB / ${(maxKb / 1024).toFixed(1)} MB`;
            elements.storageBar.style.width = `${percentage}%`;
        }

        function openSettingsView(triggerEl = null) {
            callbacks.setActiveAppSection?.('settings', triggerEl);
            callbacks.markOnboardingSettingsSeen?.();
            callbacks.updateOnboardingCues?.();
            updateStorageInfo();
        }

        function closeSettingsView() {
            if (elements.settingsView) elements.settingsView.classList.remove('settings-split-active');
            callbacks.closeOtherDetailModals?.(null);
            (callbacks.detailModals?.() || []).forEach((modalEl) => callbacks.clearDetailModalPresentation?.(modalEl));
            callbacks.stopFloatingPreviewAutoRefresh?.();
        }

        function openPaymentCyclesManagerPanel(triggerEl = null, options = {}) {
            if (!callbacks.getFeatureFlags?.().paymentCycles) return;
            callbacks.closeOtherDetailModals?.(null);
            openSettingsView(triggerEl);
            if (elements.paymentCyclesManagerPanel) elements.paymentCyclesManagerPanel.style.display = '';
            updateStorageInfo();
            callbacks.setPaymentCyclesListExpanded?.(!!options?.expandList);
            callbacks.renderPaymentCycles?.();
            if (elements.paymentCyclesManagerPanel) {
                requestAnimationFrame(() => {
                    elements.paymentCyclesManagerPanel.scrollIntoView({ block: 'start', behavior: 'smooth' });
                });
            }
        }

        function openPaymentCyclesManagerFromDashboard(triggerEl = null) {
            if (!callbacks.getFeatureFlags?.().paymentCycles) {
                callbacks.showToast?.('Enable Payment Cycles in Settings first.');
                return;
            }
            openPaymentCyclesManagerPanel(triggerEl, { expandList: true });
        }

        function closePaymentCyclesManagerPanel() {
            if (elements.paymentCyclesManagerPanel) elements.paymentCyclesManagerPanel.style.display = 'none';
        }

        function openFloatingControlsSettingsModal(triggerEl = null) {
            if (!callbacks.getFeatureFlags?.().floatingCallControls || !elements.floatingControlsSettingsModal) return;
            modalManager?.open?.(elements.floatingControlsSettingsModal, {
                focusSelector: '#floating-controls-size-mode',
                sourceEl: triggerEl
            });
            if (elements.openFloatingControlsSettingsBtn) {
                elements.openFloatingControlsSettingsBtn.setAttribute('aria-expanded', 'true');
            }
            requestAnimationFrame(() => {
                callbacks.updateFloatingPreview?.(callbacks.getFeatureFlags?.(), { randomize: true });
                callbacks.startFloatingPreviewAutoRefresh?.(callbacks.getFeatureFlags?.());
            });
        }

        function closeFloatingControlsSettingsModal() {
            callbacks.stopFloatingPreviewAutoRefresh?.();
            if (elements.floatingControlsSettingsModal) {
                modalManager?.close?.(elements.floatingControlsSettingsModal);
            }
            if (elements.openFloatingControlsSettingsBtn) {
                elements.openFloatingControlsSettingsBtn.setAttribute('aria-expanded', 'false');
            }
        }

        function applyFeatureFlags(flags) {
            const notesEnabled = !!flags.notes;
            if (elements.liveCallNotesInput) elements.liveCallNotesInput.style.display = notesEnabled ? '' : 'none';
            if (elements.callNotesInput) elements.callNotesInput.style.display = notesEnabled ? '' : 'none';
            const callNotesLabel = document.querySelector('label[for="call-notes"]');
            if (callNotesLabel) callNotesLabel.style.display = notesEnabled ? '' : 'none';
            document.querySelectorAll('.notes-column').forEach((el) => {
                el.style.display = notesEnabled ? '' : 'none';
            });

            const paymentCyclesEnabled = !!flags.paymentCycles;
            callbacks.setPaymentCyclesEnabled?.(paymentCyclesEnabled);
            if (elements.paymentCyclesSection) {
                elements.paymentCyclesSection.style.display = paymentCyclesEnabled ? '' : 'none';
            }
            if (elements.paymentCyclesConfig) {
                elements.paymentCyclesConfig.classList.toggle('hidden', !paymentCyclesEnabled);
            }
            if (elements.openPaymentCyclesSettingsBtn) {
                elements.openPaymentCyclesSettingsBtn.classList.toggle('hidden', !paymentCyclesEnabled);
            }
            if (elements.paymentCyclesToggle) {
                elements.paymentCyclesToggle.checked = paymentCyclesEnabled;
            }
            if (!paymentCyclesEnabled && callbacks.isPaymentCyclesManagerOpen?.()) {
                closePaymentCyclesManagerPanel();
            }

            const rpgEnabled = !!flags.rpg;
            if (elements.rpgProgressCard) elements.rpgProgressCard.style.display = rpgEnabled ? '' : 'none';
            if (elements.dailyQuestsSection) elements.dailyQuestsSection.style.display = rpgEnabled ? '' : 'none';
            if (elements.featureRpgToggle) elements.featureRpgToggle.checked = rpgEnabled;
            if (!rpgEnabled && elements.achievementDetailModal && modalManager?.isOpen?.(elements.achievementDetailModal)) {
                const selectedAchievement = callbacks.getAchievementById?.(callbacks.getSelectedAchievementId?.());
                if (selectedAchievement?.rpgOnly) callbacks.closeAchievementDetailModal?.();
            }

            flags.uiRefresh = true;
            document.body.classList.add('ui-refresh-v1');
            if (elements.focusWorkstrip) elements.focusWorkstrip.style.display = '';

            if (elements.openFloatingControlsSettingsBtn) {
                elements.openFloatingControlsSettingsBtn.style.display = flags.floatingCallControls ? '' : 'none';
                elements.openFloatingControlsSettingsBtn.setAttribute(
                    'aria-expanded',
                    elements.floatingControlsSettingsModal && modalManager?.isOpen?.(elements.floatingControlsSettingsModal) ? 'true' : 'false'
                );
            }
            if (floatingControls.activeCardCustomization) {
                floatingControls.activeCardCustomization.style.display = flags.floatingShowActiveCard ? '' : 'none';
            }
            if (floatingControls.sizeModeSelect) floatingControls.sizeModeSelect.value = flags.floatingControlsSizeMode || 'auto';
            if (floatingControls.secondaryActionSelect) floatingControls.secondaryActionSelect.value = flags.floatingSecondaryAction || 'add';
            if (floatingControls.showActiveCardToggle) floatingControls.showActiveCardToggle.checked = !!flags.floatingShowActiveCard;
            if (floatingControls.activeShowTimerToggle) floatingControls.activeShowTimerToggle.checked = !!flags.floatingActiveShowTimer;
            if (floatingControls.activeShowEarningsToggle) floatingControls.activeShowEarningsToggle.checked = !!flags.floatingActiveShowEarnings;
            if (floatingControls.activeShowRateToggle) floatingControls.activeShowRateToggle.checked = !!flags.floatingActiveShowRate;
            if (floatingControls.activeShowAdjustToggle) floatingControls.activeShowAdjustToggle.checked = !!flags.floatingActiveShowAdjust;
            if (floatingControls.oneHandedToggle) floatingControls.oneHandedToggle.checked = !!flags.floatingOneHanded;
            if (floatingControls.previewEnabledToggle) {
                floatingControls.previewEnabledToggle.checked = !!state.enableFloatingPreviewTesting && !!flags.floatingPreviewEnabled;
                floatingControls.previewEnabledToggle.disabled = !state.enableFloatingPreviewTesting;
            }
            if (floatingControls.featureStateNote) {
                floatingControls.featureStateNote.style.display = flags.floatingCallControls ? 'none' : '';
            }
            if (!state.enableFloatingPreviewTesting && floatingControls.previewContainer) {
                floatingControls.previewContainer.style.display = 'none';
            }

            callbacks.updateFloatingPreview?.(flags);
            callbacks.updateFloatingCallControls?.(flags);
            callbacks.renderAchievementsModal?.();
            callbacks.updateRpgProgress?.();
            callbacks.queueWorkstripSync?.();
        }

        function syncFeatureControlInputs(flags) {
            if (elements.featureNotesToggle) elements.featureNotesToggle.checked = !!flags.notes;
            if (elements.featurePaymentCyclesToggle) elements.featurePaymentCyclesToggle.checked = !!flags.paymentCycles;
            if (elements.featureFloatingControlsToggle) elements.featureFloatingControlsToggle.checked = !!flags.floatingCallControls;
            if (elements.featureRpgToggle) elements.featureRpgToggle.checked = !!flags.rpg;
            if (floatingControls.showActiveCardToggle) floatingControls.showActiveCardToggle.checked = !!flags.floatingShowActiveCard;
            if (floatingControls.activeShowTimerToggle) floatingControls.activeShowTimerToggle.checked = !!flags.floatingActiveShowTimer;
            if (floatingControls.activeShowEarningsToggle) floatingControls.activeShowEarningsToggle.checked = !!flags.floatingActiveShowEarnings;
            if (floatingControls.activeShowRateToggle) floatingControls.activeShowRateToggle.checked = !!flags.floatingActiveShowRate;
            if (floatingControls.activeShowAdjustToggle) floatingControls.activeShowAdjustToggle.checked = !!flags.floatingActiveShowAdjust;
            if (floatingControls.oneHandedToggle) floatingControls.oneHandedToggle.checked = !!flags.floatingOneHanded;
            if (floatingControls.secondaryActionSelect) floatingControls.secondaryActionSelect.value = flags.floatingSecondaryAction || 'add';
            if (floatingControls.previewEnabledToggle) {
                floatingControls.previewEnabledToggle.checked = !!state.enableFloatingPreviewTesting && !!flags.floatingPreviewEnabled;
            }
        }

        function bindFeatureToggleControls() {
            const onFlagChange = (mutator, options = {}) => (event) => {
                const flags = callbacks.getFeatureFlags?.();
                if (!flags) return;
                mutator(flags, event);
                callbacks.saveFeatureFlags?.(flags);

                if (options.syncPaymentCyclesRuntime) {
                    callbacks.setPaymentCyclesEnabled?.(!!event?.target?.checked);
                    callbacks.ensurePaymentCyclesDataLoaded?.();
                    try { callbacks.savePaymentCycles?.(); } catch (error) {}
                    if (elements.paymentCyclesToggle) {
                        elements.paymentCyclesToggle.checked = !!event?.target?.checked;
                        elements.paymentCyclesToggle.dispatchEvent(new Event('change'));
                    }
                }

                if (options.resetFloatingDefaults) {
                    callbacks.saveFloatingDockManualPosition?.(null);
                }

                applyFeatureFlags(flags);

                if (options.afterApply) options.afterApply(flags, event);
            };

            if (elements.featureNotesToggle) {
                elements.featureNotesToggle.addEventListener('change', onFlagChange((flags, event) => {
                    flags.notes = !!event.target.checked;
                }));
            }

            if (elements.featurePaymentCyclesToggle) {
                elements.featurePaymentCyclesToggle.addEventListener('change', onFlagChange((flags, event) => {
                    flags.paymentCycles = !!event.target.checked;
                }, { syncPaymentCyclesRuntime: true }));
            }

            if (elements.featureFloatingControlsToggle) {
                elements.featureFloatingControlsToggle.addEventListener('change', onFlagChange((flags, event) => {
                    flags.floatingCallControls = !!event.target.checked;
                }));
            }

            if (elements.featureRpgToggle) {
                elements.featureRpgToggle.addEventListener('change', onFlagChange((flags, event) => {
                    flags.rpg = !!event.target.checked;
                }));
            }

            if (floatingControls.sizeModeSelect) {
                floatingControls.sizeModeSelect.addEventListener('change', onFlagChange((flags, event) => {
                    flags.floatingControlsSizeMode = event.target.value;
                }));
            }

            if (floatingControls.secondaryActionSelect) {
                floatingControls.secondaryActionSelect.addEventListener('change', onFlagChange((flags, event) => {
                    flags.floatingSecondaryAction = ['add', 'goto', 'none'].includes(event.target.value) ? event.target.value : 'add';
                }));
            }

            if (floatingControls.showActiveCardToggle) {
                floatingControls.showActiveCardToggle.addEventListener('change', onFlagChange((flags, event) => {
                    flags.floatingShowActiveCard = !!event.target.checked;
                }));
            }

            if (floatingControls.activeShowTimerToggle) {
                floatingControls.activeShowTimerToggle.addEventListener('change', onFlagChange((flags, event) => {
                    flags.floatingActiveShowTimer = !!event.target.checked;
                }));
            }

            if (floatingControls.activeShowEarningsToggle) {
                floatingControls.activeShowEarningsToggle.addEventListener('change', onFlagChange((flags, event) => {
                    flags.floatingActiveShowEarnings = !!event.target.checked;
                }));
            }

            if (floatingControls.activeShowRateToggle) {
                floatingControls.activeShowRateToggle.addEventListener('change', onFlagChange((flags, event) => {
                    flags.floatingActiveShowRate = !!event.target.checked;
                }));
            }

            if (floatingControls.activeShowAdjustToggle) {
                floatingControls.activeShowAdjustToggle.addEventListener('change', onFlagChange((flags, event) => {
                    flags.floatingActiveShowAdjust = !!event.target.checked;
                }));
            }

            if (floatingControls.oneHandedToggle) {
                floatingControls.oneHandedToggle.addEventListener('change', onFlagChange((flags, event) => {
                    flags.floatingOneHanded = !!event.target.checked;
                }));
            }

            if (floatingControls.previewEnabledToggle) {
                floatingControls.previewEnabledToggle.addEventListener('change', onFlagChange((flags, event) => {
                    flags.floatingPreviewEnabled = !!event.target.checked;
                }));
            }

            if (floatingControls.previewRandomizeBtn) {
                floatingControls.previewRandomizeBtn.addEventListener('click', () => {
                    callbacks.updateFloatingPreview?.(callbacks.getFeatureFlags?.(), { randomize: true });
                });
            }

            if (floatingControls.resetPositionBtn) {
                floatingControls.resetPositionBtn.addEventListener('click', () => {
                    callbacks.setFloatingDockManualPosition?.(null);
                    callbacks.saveFloatingDockManualPosition?.(null);
                    callbacks.updateFloatingCallControls?.(callbacks.getFeatureFlags?.());
                    callbacks.showToast?.('Dock position reset.');
                });
            }

            if (floatingControls.resetDefaultsBtn) {
                floatingControls.resetDefaultsBtn.addEventListener('click', () => {
                    const flags = callbacks.getFeatureFlags?.();
                    if (!flags) return;
                    flags.floatingControlsSizeMode = 'auto';
                    flags.floatingSecondaryAction = 'add';
                    flags.floatingShowActiveCard = true;
                    flags.floatingActiveShowTimer = true;
                    flags.floatingActiveShowEarnings = true;
                    flags.floatingActiveShowRate = false;
                    flags.floatingActiveShowAdjust = false;
                    flags.floatingOneHanded = false;
                    flags.floatingPreviewEnabled = true;
                    callbacks.setFloatingDockManualPosition?.(null);
                    callbacks.saveFloatingDockManualPosition?.(null);
                    callbacks.saveFeatureFlags?.(flags);
                    applyFeatureFlags(flags);
                    callbacks.updateFloatingPreview?.(flags, { randomize: true });
                    callbacks.updateFloatingCallControls?.(flags);
                    callbacks.showToast?.('Floating controls reset to defaults.');
                });
            }

            if (elements.paymentCyclesToggle) {
                elements.paymentCyclesToggle.addEventListener('change', (event) => {
                    const flags = callbacks.getFeatureFlags?.();
                    if (!flags) return;
                    flags.paymentCycles = !!event.target.checked;
                    callbacks.saveFeatureFlags?.(flags);
                    if (elements.featurePaymentCyclesToggle) {
                        elements.featurePaymentCyclesToggle.checked = !!event.target.checked;
                    }
                });
            }
        }

        function bindViewListeners() {
            if (elements.openPaymentCyclesSettingsBtn) {
                elements.openPaymentCyclesSettingsBtn.addEventListener('click', (event) => {
                    openPaymentCyclesManagerPanel(event.currentTarget, { expandList: true });
                });
            }
            if (elements.mobileSettingsOpenBtn) {
                elements.mobileSettingsOpenBtn.addEventListener('click', (event) => openSettingsView(event.currentTarget));
            }
            if (elements.settingsToggleBtn) {
                elements.settingsToggleBtn.addEventListener('click', (event) => openSettingsView(event.currentTarget));
            }
            if (elements.tzSelect) {
                elements.tzSelect.addEventListener('change', () => {
                    callbacks.setUserTimeZone?.(elements.tzSelect.value);
                    callbacks.updateStatistics?.();
                    callbacks.displayCalls?.();
                    callbacks.updateLocalTime?.();
                });
            }
            if (elements.resetTzBtn) {
                elements.resetTzBtn.addEventListener('click', () => {
                    if (elements.tzSelect) elements.tzSelect.value = '';
                    callbacks.setUserTimeZone?.('');
                    callbacks.updateStatistics?.();
                    callbacks.displayCalls?.();
                    callbacks.updateLocalTime?.();
                });
            }
            if (elements.openDataHubBtn) {
                elements.openDataHubBtn.addEventListener('click', callbacks.openDataHubModal);
            }
            if (elements.openFloatingControlsSettingsBtn) {
                elements.openFloatingControlsSettingsBtn.addEventListener('click', (event) => {
                    openFloatingControlsSettingsModal(event.currentTarget);
                });
            }
            if (elements.closeFloatingControlsSettingsBtn) {
                elements.closeFloatingControlsSettingsBtn.addEventListener('click', closeFloatingControlsSettingsModal);
            }
            if (elements.doneFloatingControlsSettingsBtn) {
                elements.doneFloatingControlsSettingsBtn.addEventListener('click', closeFloatingControlsSettingsModal);
            }
            if (elements.closePaymentCyclesSettingsModalBtn) {
                elements.closePaymentCyclesSettingsModalBtn.addEventListener('click', closePaymentCyclesManagerPanel);
            }
            if (elements.donePaymentCyclesSettingsBtn) {
                elements.donePaymentCyclesSettingsBtn.addEventListener('click', closePaymentCyclesManagerPanel);
            }
            if (elements.viewAllPaymentCyclesBtn) {
                elements.viewAllPaymentCyclesBtn.addEventListener('click', (event) => {
                    openPaymentCyclesManagerFromDashboard(event.currentTarget);
                });
            }
            if (elements.paymentCyclesToggleAllBtn) {
                elements.paymentCyclesToggleAllBtn.addEventListener('click', () => {
                    const count = callbacks.getPaymentCyclesCount?.() || 0;
                    if (!count) return;
                    callbacks.setPaymentCyclesListExpanded?.(!callbacks.getPaymentCyclesListExpanded?.(), count);
                });
            }
        }

        return {
            applyFeatureFlags,
            bindFeatureToggleControls,
            bindViewListeners,
            closeFloatingControlsSettingsModal,
            closePaymentCyclesManagerPanel,
            closeSettingsView,
            openFloatingControlsSettingsModal,
            openPaymentCyclesManagerFromDashboard,
            openPaymentCyclesManagerPanel,
            openSettingsView,
            syncFeatureControlInputs,
            updateStorageInfo
        };
    }

    window.WTTSettingsManager = { create: createSettingsManager };
})();
