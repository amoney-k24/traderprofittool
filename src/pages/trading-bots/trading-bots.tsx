import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Localize } from '@deriv-com/translations';
import { useStore } from '@/hooks/useStore';
import { save_types } from '@/external/bot-skeleton';
import './trading-bots.scss';

const botName = 'DIFFERS, OVER 1 REC OVER 5 AI';
const botUrl = `${window.location.pathname.includes('/preview') ? '/bot/preview' : ''}/bots/differs-over-1-rec-over-5-ai.xml`;

const TradingBots = observer(({ onOpenBuilder }: { onOpenBuilder: () => void }) => {
    const { load_modal, blockly_store, run_panel } = useStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const busy = run_panel.is_running || run_panel.has_open_contract;

    const openBot = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await fetch(botUrl);
            if (!response.ok) throw new Error('Bot unavailable');
            const xml = await response.text();
            const document = new DOMParser().parseFromString(xml, 'text/xml');
            if (document.querySelector('parsererror') || document.documentElement.localName !== 'xml') {
                throw new Error('Invalid bot file');
            }
            await load_modal.loadStrategyToBuilder({
                id: 'differs-over-1-rec-over-5-ai',
                name: botName,
                save_type: save_types.LOCAL,
                timestamp: Date.now(),
                xml,
            });
            onOpenBuilder();
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='trading-bots' aria-labelledby='trading-bots-heading'>
            <header className='trading-bots__header'>
                <span className='trading-bots__eyebrow'><Localize i18n_default_text='STRATEGY LIBRARY' /></span>
                <h1 id='trading-bots-heading'><Localize i18n_default_text='Trading Bots' /></h1>
                <p><Localize i18n_default_text='Choose a bot and open it in Bot Builder to review its settings.' /></p>
            </header>
            <article className='trading-bots__card'>
                <div className='trading-bots__number' aria-hidden='true'>01</div>
                <div className='trading-bots__details'>
                    <span className='trading-bots__tag'><Localize i18n_default_text='XML STRATEGY' /></span>
                    <h2>{botName}</h2>
                    <p><Localize i18n_default_text='Includes the supplied strategy with its original trading rules and parameters.' /></p>
                    <dl>
                        <div><dt><Localize i18n_default_text='Market' /></dt><dd>Volatility 75 (1s) Index</dd></div>
                        <div><dt><Localize i18n_default_text='Contract type' /></dt><dd><Localize i18n_default_text='Digits Over/Under' /></dd></div>
                    </dl>
                    <div className='trading-bots__actions'>
                        <button type='button' onClick={openBot} disabled={loading || blockly_store.is_loading || busy}>
                            {loading ? <Localize i18n_default_text='Loading bot…' /> : <Localize i18n_default_text='Open in Bot Builder' />}
                        </button>
                        <a href={botUrl} download='DIFFERS,OVER 1 REC OVER 5 AI.xml'><Localize i18n_default_text='Download XML' /></a>
                    </div>
                    {busy && <p role='status'><Localize i18n_default_text='Stop the current bot and wait for its contract to close before loading another strategy.' /></p>}
                    {error && <p className='trading-bots__error' role='alert'><Localize i18n_default_text='Unable to load this bot. Please try again or download the XML to import it manually.' /></p>}
                </div>
            </article>
            <p className='trading-bots__note'><Localize i18n_default_text='Review stake, take profit, and stop loss settings before running. Test on a demo account first. Trading involves risk and profits are not guaranteed.' /></p>
        </section>
    );
});

export default TradingBots;
