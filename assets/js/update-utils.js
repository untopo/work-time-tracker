(function () {
    function normalizeVersionString(version) {
        return String(version || '')
            .trim()
            .replace(/^v/i, '');
    }

    function parseVersionParts(version) {
        return normalizeVersionString(version)
            .split('.')
            .map((part) => Number.parseInt(part, 10) || 0);
    }

    function isRemoteVersionNewer(remoteVersion, localVersion) {
        const remoteParts = parseVersionParts(remoteVersion);
        const localParts = parseVersionParts(localVersion);
        const total = Math.max(remoteParts.length, localParts.length, 3);
        for (let i = 0; i < total; i += 1) {
            const remote = remoteParts[i] || 0;
            const local = localParts[i] || 0;
            if (remote !== local) return remote > local;
        }
        return false;
    }

    function extractReleaseTag(manifest) {
        const explicit = normalizeVersionString(manifest?.latestVersion);
        const releaseUrl = String(manifest?.releaseUrl || '').trim();
        if (releaseUrl) {
            const match = releaseUrl.match(/\/tag\/([^/?#]+)/i);
            if (match?.[1]) return String(match[1]);
        }
        return explicit ? `v${explicit}` : '';
    }

    function isOfficialReleaseAssetUrl(url, officialPrefix) {
        const value = String(url || '').trim();
        return value.startsWith(String(officialPrefix || ''));
    }

    async function fetchUpdateManifest(manifestUrls) {
        for (const baseUrl of manifestUrls || []) {
            try {
                const separator = baseUrl.includes('?') ? '&' : '?';
                const response = await fetch(`${baseUrl}${separator}t=${Date.now()}`, { cache: 'no-store' });
                if (!response.ok) continue;
                const payload = await response.json();
                if (payload && typeof payload === 'object' && payload.latestVersion) {
                    return payload;
                }
            } catch (error) {
                console.debug('Update manifest fetch failed for', baseUrl, error);
            }
        }
        return null;
    }

    async function fetchReleaseByTag({ releasesApiBase, tag }) {
        const safeTag = String(tag || '').trim();
        if (!safeTag) return null;
        try {
            const response = await fetch(`${releasesApiBase}/tags/${encodeURIComponent(safeTag)}?t=${Date.now()}`, {
                cache: 'no-store'
            });
            if (!response.ok) return null;
            const payload = await response.json();
            if (!payload || typeof payload !== 'object' || !Array.isArray(payload.assets)) return null;
            return payload;
        } catch (error) {
            console.warn('Failed to fetch release metadata for in-app update:', error);
            return null;
        }
    }

    function pickDesktopInstallerAsset(releasePayload, officialPrefix) {
        const assets = Array.isArray(releasePayload?.assets) ? releasePayload.assets : [];
        const byName = assets.filter((asset) => typeof asset?.name === 'string' && typeof asset?.browser_download_url === 'string');
        const preferred = byName.find((asset) => /_x64-setup\.exe$/i.test(asset.name));
        if (preferred && isOfficialReleaseAssetUrl(preferred.browser_download_url, officialPrefix)) return preferred;
        const fallbackExe = byName.find((asset) => /\.exe$/i.test(asset.name));
        if (fallbackExe && isOfficialReleaseAssetUrl(fallbackExe.browser_download_url, officialPrefix)) return fallbackExe;
        const fallbackMsi = byName.find((asset) => /\.msi$/i.test(asset.name));
        if (fallbackMsi && isOfficialReleaseAssetUrl(fallbackMsi.browser_download_url, officialPrefix)) return fallbackMsi;
        return null;
    }

    function pickAndroidInstallerAsset(releasePayload, officialPrefix) {
        const assets = Array.isArray(releasePayload?.assets) ? releasePayload.assets : [];
        const apkAssets = assets.filter((asset) => /\.apk$/i.test(String(asset?.name || '')) && typeof asset?.browser_download_url === 'string');
        const preferredRelease = apkAssets.find((asset) => /(signed|release)(?!.*unsigned).*\.apk$/i.test(String(asset.name || '')));
        if (preferredRelease && isOfficialReleaseAssetUrl(preferredRelease.browser_download_url, officialPrefix)) return preferredRelease;
        const fallbackRelease = apkAssets.find((asset) => !/debug|unsigned/i.test(String(asset.name || '')));
        if (fallbackRelease && isOfficialReleaseAssetUrl(fallbackRelease.browser_download_url, officialPrefix)) return fallbackRelease;
        const debugApk = apkAssets.find((asset) => /debug.*\.apk$/i.test(String(asset.name || '')));
        if (debugApk && isOfficialReleaseAssetUrl(debugApk.browser_download_url, officialPrefix)) return debugApk;
        return null;
    }

    async function resolveInAppUpdateAsset({ manifest, targetPlatform, releasesApiBase, officialPrefix }) {
        const tag = extractReleaseTag(manifest);
        if (!tag) return null;
        const releasePayload = await fetchReleaseByTag({ releasesApiBase, tag });
        if (!releasePayload) return null;
        if (targetPlatform === 'desktop') return pickDesktopInstallerAsset(releasePayload, officialPrefix);
        if (targetPlatform === 'android') return pickAndroidInstallerAsset(releasePayload, officialPrefix);
        return null;
    }

    window.WTTUpdateUtils = {
        normalizeVersionString,
        parseVersionParts,
        isRemoteVersionNewer,
        extractReleaseTag,
        isOfficialReleaseAssetUrl,
        fetchUpdateManifest,
        fetchReleaseByTag,
        pickDesktopInstallerAsset,
        pickAndroidInstallerAsset,
        resolveInAppUpdateAsset
    };
})();
