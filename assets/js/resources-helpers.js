(function () {
    const resourcesData = window.WTTResourcesData || {};
    const US_STATE_ABBREVIATIONS = resourcesData.US_STATE_ABBREVIATIONS || {};

    function normalizeSearchText(value) {
        return String(value || '')
            .replace(/[，]/g, ',')
            .replace(/\s+/g, ' ')
            .replace(/\s*,\s*/g, ', ')
            .trim();
    }

    function trimUsCountrySuffix(value) {
        return String(value || '')
            .replace(/,\s*(united states of america|united states|estados unidos de américa|estados unidos)\s*$/i, '')
            .trim();
    }

    function normalizeStateToken(value) {
        const normalized = normalizeSearchText(value).toLowerCase();
        if (!normalized) return '';
        if (/^[a-z]{2}$/.test(normalized)) return normalized.toUpperCase();
        return US_STATE_ABBREVIATIONS[normalized] || '';
    }

    function parseCityStateQuery(query) {
        const normalized = normalizeSearchText(query);
        if (!normalized) return null;
        const commaMatch = normalized.match(/^(.+?),\s*([A-Za-z .]+)$/);
        if (commaMatch) {
            const city = normalizeSearchText(commaMatch[1]);
            const state = normalizeStateToken(commaMatch[2]);
            if (city && state) return { city, state };
        }
        const parts = normalized.split(' ');
        if (parts.length >= 2) {
            const maybeState = normalizeStateToken(parts[parts.length - 1]);
            const city = normalizeSearchText(parts.slice(0, -1).join(' '));
            if (city && maybeState) return { city, state: maybeState };
        }
        return null;
    }

    function detectLookupIntent(rawQuery) {
        const normalized = String(rawQuery || '').trim();
        if (/^\d{5}(?:-\d{4})?$/.test(normalized)) return 'ZIP';
        if (parseCityStateQuery(normalized) && !/\d/.test(normalized)) return 'City / State';
        if (/\d/.test(normalized)) return 'Address';
        return 'Location';
    }

    function isInvalidTranslationText(text, sourceText = '') {
        const normalized = String(text || '').trim().toLowerCase();
        const normalizedSource = String(sourceText || '').trim().toLowerCase();
        if (!normalized) return true;
        const blockedPhrases = [
            'please, specify two different languages',
            'please specify two different languages',
            'specify two different languages',
            'could not translate',
            'translation unavailable',
            'no translation'
        ];
        if (blockedPhrases.includes(normalized)) return true;
        if (normalized === normalizedSource) return true;
        return false;
    }

    function normalizeTermMatches(matches, sourceLang, targetLang, currentQuery = '') {
        const seen = new Set();
        const normalizedQuery = normalizeSearchText(currentQuery).toLowerCase();
        return (Array.isArray(matches) ? matches : [])
            .filter((item) => item && typeof item.translation === 'string')
            .map((item) => {
                const rawQuality = Number(item.match ?? item.quality ?? 0);
                const quality = rawQuality > 1 ? rawQuality / 100 : rawQuality;
                const segment = normalizeSearchText(item.segment || '');
                const translation = normalizeSearchText(item.translation || '');
                const usageCount = Number(item['usage-count'] || 0);
                const subject = String(item.subject || '');
                let rankBoost = 0;
                if (segment.toLowerCase() === normalizedQuery) rankBoost += 0.35;
                if (segment.toLowerCase().startsWith(normalizedQuery)) rankBoost += 0.18;
                if (translation.split(' ').length <= 3) rankBoost += 0.08;
                if (usageCount >= 3) rankBoost += Math.min(0.12, usageCount * 0.02);
                if (subject && subject !== 'All' && subject !== 'General') rankBoost += 0.05;
                return {
                    translation,
                    segment,
                    quality: quality + rankBoost,
                    source: String(item.source || ''),
                    target: String(item.target || ''),
                    subject,
                    usageCount
                };
            })
            .filter((item) => item.translation && item.segment)
            .filter((item) => !isInvalidTranslationText(item.translation, item.segment))
            .filter((item) => item.target.toLowerCase().startsWith(targetLang))
            .filter((item) => item.source.toLowerCase().startsWith(sourceLang))
            .filter((item) => {
                const key = item.translation.toLowerCase();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .sort((a, b) => b.quality - a.quality)
            .slice(0, 10);
    }

    function normalizeDictionaryEntry(data) {
        const entries = Array.isArray(data?.value) ? data.value : Array.isArray(data) ? data : [];
        return entries[0] || null;
    }

    function normalizeSemanticHints(data) {
        return (Array.isArray(data?.value) ? data.value : Array.isArray(data) ? data : [])
            .map((item) => normalizeSearchText(item?.word || ''))
            .filter(Boolean)
            .filter((word, index, arr) => arr.indexOf(word) === index)
            .slice(0, 6);
    }

    function rankAddressMatches(matches, query) {
        const normalizedQuery = normalizeSearchText(query).toLowerCase();
        return (Array.isArray(matches) ? matches : [])
            .map((item) => {
                const displayName = trimUsCountrySuffix(item?.display_name || '');
                const address = item?.address || {};
                const title = trimUsCountrySuffix([
                    address.house_number,
                    address.road,
                    address.city || address.town || address.village || address.hamlet,
                    address.county,
                    address.state
                ].filter(Boolean).join(', ')) || displayName;
                let score = 0;
                if (displayName.toLowerCase() === normalizedQuery) score += 9;
                if (displayName.toLowerCase().startsWith(normalizedQuery)) score += 6;
                if (title.toLowerCase().startsWith(normalizedQuery)) score += 5;
                if (/^\d{5}/.test(normalizedQuery) && String(address.postcode || '').startsWith(normalizedQuery)) score += 8;
                if (/\d/.test(normalizedQuery) && address.house_number) score += 2;
                if (address.road) score += 1;
                if (address.city || address.town || address.village) score += 1;
                return {
                    ...item,
                    __score: score,
                    __title: title,
                    __subtitle: `${address.postcode || '--'} | ${address.city || address.town || address.village || address.county || '--'}, ${address.state || '--'}`
                };
            })
            .sort((a, b) => b.__score - a.__score);
    }

    window.WTTResourcesHelpers = {
        normalizeSearchText,
        trimUsCountrySuffix,
        normalizeStateToken,
        parseCityStateQuery,
        detectLookupIntent,
        isInvalidTranslationText,
        normalizeTermMatches,
        normalizeDictionaryEntry,
        normalizeSemanticHints,
        rankAddressMatches
    };
})();
