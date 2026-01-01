import React from 'react';
import { ChevronLeft, Printer } from 'lucide-react';
import { EventDetails, Song, Singer } from '../types';
import { PRINT } from '../styles/print';

interface PrintViewProps {
  currentEvent: EventDetails | null;
  songs: Song[];
  singers: Singer[];
  appDefaults: any;
  activeSingers: Singer[];
  onBack: () => void;
}

export const PrintView: React.FC<PrintViewProps> = ({ currentEvent, songs, singers, appDefaults, activeSingers, onBack }) => {
    if (!currentEvent) return null;

    const formatTime12Hour = (time24: string) => {
        if (!time24) return '';
        const [hStr, mStr] = time24.split(':');
        const h = parseInt(hStr, 10);
        const m = mStr;
        const period = h >= 12 ? 'pm' : 'am';
        const h12 = h % 12 || 12;
        return `${h12}:${m} ${period}`;
    };

    const timestampMap: Record<string, string> = {};
    if (currentEvent.endTime) {
        const end = new Date(`2000-01-01T${currentEvent.endTime}`);
        const avgMs = currentEvent.settings.avgSongMin * 60 * 1000;
        const countToShow = currentEvent.settings.showTimestampsCount;
        let currentSongIndexReverse = 0;
        [...currentEvent.sets].reverse().forEach(set => {
            [...set.slots].reverse().forEach(slot => {
                if (!slot.songId) return;
                if (currentSongIndexReverse < countToShow) {
                    const time = new Date(end.getTime() - ((currentSongIndexReverse + 1) * avgMs));
                    timestampMap[slot.id] = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
                }
                currentSongIndexReverse++;
            });
        });
    }

    const highlightColor = appDefaults.keyHighlightColor || 'yellow';

    return (
        <div className={PRINT.CONTAINER}>
            <style>{`
                @media print {
                    @page { margin: 0.5in; }
                    body { -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div className={PRINT.CONTROLS}>
                <button onClick={onBack} className={PRINT.BUTTON_BACK}>
                    <ChevronLeft className="mr-2" /> Back to Editor
                </button>
                <button onClick={() => window.print()} className={PRINT.BUTTON_PRINT}>
                    <Printer className="mr-2" /> Print Now
                </button>
            </div>

            <div className={PRINT.HEADER}>
                <h1 className={PRINT.TITLE_MAIN}>Set List</h1>
                <h2 className={PRINT.TITLE_SUB}>
                    {currentEvent.name}
                    {currentEvent.startTime && <span className="ml-2">@ {formatTime12Hour(currentEvent.startTime)}</span>}
                </h2>
                <div className={PRINT.META}>{currentEvent.gigType} • {currentEvent.date}</div>
            </div>

            <div className={PRINT.TABLE_HEADER}>
                <div className="col-span-1">#</div>
                <div className="col-span-5">Song</div>
                <div className="col-span-1">Key</div>
                <div className="col-span-2">Singer</div>
                <div className="col-span-3 text-right">Artist</div>
            </div>

            {currentEvent.specialMoments.length > 0 && (
                <div className={PRINT.MOMENTS.CONTAINER}>
                    <h3 className={PRINT.MOMENTS.TITLE}>Special Moments</h3>
                    {currentEvent.specialMoments.map((m, idx) => {
                        const song = songs.find(s => s.id === m.songId);
                        let singerName = '';
                        let key = song?.originalKey || '';
                        if (m.assignedSingerId) {
                            const s = singers.find(x => x.id === m.assignedSingerId);
                            singerName = s?.name || '';
                             if (s && song && s.repertoire[song.id] && s.repertoire[song.id] !== 'OG') {
                                key = s.repertoire[song.id];
                            }
                        } else if (song) {
                             const capable = activeSingers.find(s => s.repertoire[song.id]);
                             if (capable) {
                                 singerName = capable.name;
                                 if (capable.repertoire[song.id] !== 'OG') key = capable.repertoire[song.id];
                             }
                        }
                        const isKeyChange = song && key !== song.originalKey;

                        return (
                             <div key={m.id} className={PRINT.ROW}>
                                <div className="col-span-1 font-mono text-gray-500 text-xs">SP-{idx+1}</div>
                                <div className="col-span-5 font-bold">
                                    {song?.title || 'Unknown Song'}
                                    <span className={PRINT.MOMENTS.BADGE}>{m.momentName}</span>
                                </div>
                                <div className="col-span-1">
                                    <span className={PRINT.KEY_BADGE(isKeyChange, highlightColor)}>{key}</span>
                                </div>
                                <div className="col-span-2">{singerName}</div>
                                <div className="col-span-3 text-right text-gray-600">{song?.artist}</div>
                             </div>
                        );
                    })}
                </div>
            )}

            {currentEvent.sets.map((set, setIdx) => (
                <div key={set.id} className={PRINT.SET_CONTAINER}>
                    <div className={PRINT.SET_HEADER}>
                        <h3 className={PRINT.SET_TITLE}>{set.name}</h3>
                        <span className="text-sm font-normal text-gray-500">{set.slots.filter(s => s.songId).length} songs</span>
                    </div>
                    {set.slots.map((slot, slotIdx) => {
                        const song = songs.find(s => s.id === slot.songId);
                        if (!song) return null;

                        const singer = singers.find(s => s.id === slot.singerId);
                        const isKeyChange = slot.key !== song.originalKey;
                        const timestamp = timestampMap[slot.id];

                        return (
                            <div key={slot.id} className={PRINT.ROW}>
                                <div className="col-span-1 font-mono text-gray-500">{slotIdx + 1}</div>
                                <div className="col-span-5 font-bold flex items-center">
                                    {song.title}
                                    {timestamp && <span className={PRINT.TIMESTAMP}>{timestamp}</span>}
                                </div>
                                <div className="col-span-1">
                                     <span className={PRINT.KEY_BADGE(isKeyChange, highlightColor)}>
                                        {slot.key}
                                     </span>
                                </div>
                                <div className="col-span-2 truncate">{singer?.name}</div>
                                <div className="col-span-3 text-right text-gray-600 truncate">{song.artist}</div>
                            </div>
                        )
                    })}
                </div>
            ))}

            {currentEvent.endTime && (
                <div className={PRINT.END_TIME}>
                    Event Ends: {formatTime12Hour(currentEvent.endTime)}
                </div>
            )}

            {(currentEvent.doNotPlay.length > 0) && (
                 <div className={PRINT.DNP_BOX}>
                    <h3 className={PRINT.DNP_TITLE}>
                         <span className="mr-2">🚫</span> Do Not Play List
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {currentEvent.doNotPlay.map((item, idx) => (
                            <span key={idx} className={PRINT.DNP_TAG}>
                                {item.type === 'ARTIST' ? `Artist: ${item.label}` : item.label}
                            </span>
                        ))}
                    </div>
                 </div>
            )}
        </div>
    );
};