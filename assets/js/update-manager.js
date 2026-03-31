(function () {
    function createUpdateManager(config) {
        const {
            appVersion,
            appStorage,
            updateManifestUrls,
            releasesApiBase,
            officialReleaseAssetPrefix,
            dismissedVersionKey,
            elements,
            platform,
            openExternalUrl,
            tauriInvoke,
            showToast
        } = config || {};

        const utils = window.WTTUpdateUtils || {};
        const normalizeVersionString = utils.normalizeVersionString || ((value) => String(value || '').trim().replace(/^v/i, ''));
        const isRemoteVersionNewer = utils.isRemoteVersionNewer || (() => false);
        const fetchUpdateManifest = utils.fetchUpdateManifest || (async () => null);
        const resolveInAppUpdateAsset = utils.resolveInAppUpdateAsset || (async () => null);

        const {
            banner,
            currentVersionLabel,
            latestVersionLabel,
            notesLabel,
            openButton,
            laterButton,
            dismissButton
        } = elements || {};

        let pendingManifest = null;
        let actionInFlight = false;

        function hideBanner() {
            if (!banner) return;
            banner.classList.add('hidden');
        }

        function canUseInAppDesktopUpdate() {
            return Boolean(platform?.isDesktopTauri && tauriInvoke);
        }

        function canUseInAppAndroidUpdate() {
            const plugin = platform?.getAndroidInAppUpdaterPlugin?.();
            return Boolean(plugin && typeof plugin.downloadAndInstallApk === 'function');
        }

        async function tryRunInAppUpdate(manifest) {
            if (!manifest) return false;

            if (canUseInAppDesktopUpdate()) {
                const asset = await resolveInAppUpdateAsset({
                    manifest,
                    targetPlatform: 'desktop',
                    releasesApiBase,
                    officialPrefix: officialReleaseAssetPrefix
                });
                if (!asset?.browser_download_url) return false;
                await tauriInvoke('download_and_launch_windows_installer', {
                    url: asset.browser_download_url,
                    fileName: String(asset.name || '')
                });
                showToast?.('Installer downloaded. Follow the system installer prompts to finish updating.');
                return true;
            }

            if (canUseInAppAndroidUpdate()) {
                const asset = await resolveInAppUpdateAsset({
                    manifest,
                    targetPlatform: 'android',
                    releasesApiBase,
                    officialPrefix: officialReleaseAssetPrefix
                });
                if (!asset?.browser_download_url) return false;
                const updater = platform.getAndroidInAppUpdaterPlugin();
                await updater.downloadAndInstallApk({
                    url: asset.browser_download_url,
                    fileName: String(asset.name || 'Work.Time.Tracker_update.apk')
                });
                showToast?.('Downloading update APK. Android will ask you to confirm installation.');
                return true;
            }

            return false;
        }

        function renderBanner(manifest) {
            if (!banner || !manifest) return;
            pendingManifest = manifest;
            if (currentVersionLabel) currentVersionLabel.textContent = `v${normalizeVersionString(appVersion)}`;
            if (latestVersionLabel) latestVersionLabel.textContent = `v${normalizeVersionString(manifest.latestVersion)}`;
            if (notesLabel) {
                notesLabel.textContent = String(manifest.notes || 'A newer installer is available for download.');
            }
            if (openButton) {
                openButton.textContent = (canUseInAppDesktopUpdate() || canUseInAppAndroidUpdate()) ? 'Update Now' : 'View Release';
            }
            banner.classList.remove('hidden');
        }

        function dismissForVersion(version) {
            const normalized = normalizeVersionString(version);
            if (normalized) appStorage.setItem(dismissedVersionKey, normalized);
            hideBanner();
        }

        async function check() {
            if (!platform?.shouldCheckForInstalledAppUpdates?.()) return;
            const manifest = await fetchUpdateManifest(updateManifestUrls);
            if (!manifest?.latestVersion) return;
            if (!isRemoteVersionNewer(manifest.latestVersion, appVersion)) return;
            const dismissedVersion = normalizeVersionString(appStorage.getItem(dismissedVersionKey));
            const latestVersion = normalizeVersionString(manifest.latestVersion);
            if (dismissedVersion && dismissedVersion === latestVersion) return;
            renderBanner(manifest);
        }

        function bind() {
            if (openButton) {
                openButton.addEventListener('click', async () => {
                    if (actionInFlight) return;
                    actionInFlight = true;
                    const originalLabel = openButton.textContent;
                    openButton.disabled = true;
                    openButton.textContent = 'Preparing...';
                    try {
                        const handled = await tryRunInAppUpdate(pendingManifest);
                        if (!handled) {
                            const targetUrl = pendingManifest?.releaseUrl || pendingManifest?.downloadsUrl;
                            if (targetUrl) await openExternalUrl?.(targetUrl);
                        } else {
                            hideBanner();
                        }
                    } catch (error) {
                        console.error('In-app update attempt failed:', error);
                        const targetUrl = pendingManifest?.releaseUrl || pendingManifest?.downloadsUrl;
                        if (targetUrl) await openExternalUrl?.(targetUrl);
                    } finally {
                        actionInFlight = false;
                        openButton.disabled = false;
                        openButton.textContent = originalLabel;
                    }
                });
            }

            if (laterButton) {
                laterButton.addEventListener('click', () => {
                    dismissForVersion(pendingManifest?.latestVersion);
                });
            }

            if (dismissButton) {
                dismissButton.addEventListener('click', () => {
                    dismissForVersion(pendingManifest?.latestVersion);
                });
            }
        }

        return {
            bind,
            check,
            hideBanner
        };
    }

    window.WTTUpdateManager = { create: createUpdateManager };
})();
