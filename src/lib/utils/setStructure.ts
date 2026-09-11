import { EventDetails, SetStructureConfig } from '../../types';

export const calculateEstimatedSongs = (
  minutes: number,
  avgSongMin: number = 4,
  bufferSongs: number = 0
): number => {
  if (minutes <= 0) return 0;
  return Math.ceil(minutes / (avgSongMin || 4)) + (bufferSongs || 0);
};

export const calculateEstimatedMinutes = (
  songs: number,
  avgSongMin: number = 4
): number => {
  if (songs <= 0) return 0;
  return Math.round(songs * (avgSongMin || 4));
};

export const getEffectiveSetConfigs = (event: EventDetails): SetStructureConfig[] => {
  const count = Math.max(1, event.numberOfSets || 1);
  const configs: SetStructureConfig[] = [];
  const defaultMin = event.minutesPerSet || 45;
  const defaultSongs = event.songsPerSet || 10;

  for (let i = 0; i < count; i++) {
    const existingConfig = event.setConfigs?.[i];
    const existingSet = event.sets?.[i];

    const name = existingConfig?.name || existingSet?.name || `Set ${i + 1}`;
    const targetMinutes = existingConfig?.targetMinutes ?? existingSet?.targetMinutes ?? defaultMin;
    const targetSongs = existingConfig?.targetSongs ?? existingSet?.targetSongs ?? defaultSongs;
    const id = existingConfig?.id || existingSet?.id;

    configs.push({ id, name, targetMinutes, targetSongs });
  }

  return configs;
};

export const updateIndividualSetConfig = (
  event: EventDetails,
  index: number,
  updates: Partial<SetStructureConfig>
): EventDetails => {
  const currentConfigs = getEffectiveSetConfigs(event);
  const updatedConfigs = currentConfigs.map((cfg, i) => {
    if (i !== index) return cfg;
    return { ...cfg, ...updates };
  });

  // Also sync with event.sets if sets exist
  const updatedSets = event.sets?.map((set, i) => {
    if (i !== index) return set;
    return {
      ...set,
      name: updates.name ?? set.name,
      targetMinutes: updates.targetMinutes ?? set.targetMinutes,
      targetSongs: updates.targetSongs ?? set.targetSongs
    };
  });

  return {
    ...event,
    setConfigs: updatedConfigs,
    sets: updatedSets || event.sets
  };
};

export const changeNumberOfSets = (
  event: EventDetails,
  targetCount: number
): EventDetails => {
  const count = Math.max(1, Math.min(10, targetCount));
  const currentConfigs = getEffectiveSetConfigs(event);
  const defaultMin = event.minutesPerSet || 45;
  const defaultSongs = event.songsPerSet || 10;

  const newConfigs: SetStructureConfig[] = [];
  for (let i = 0; i < count; i++) {
    if (currentConfigs[i]) {
      newConfigs.push(currentConfigs[i]);
    } else {
      const prev = newConfigs[i - 1];
      newConfigs.push({
        name: `Set ${i + 1}`,
        targetMinutes: prev?.targetMinutes || defaultMin,
        targetSongs: prev?.targetSongs || defaultSongs
      });
    }
  }

  return {
    ...event,
    numberOfSets: count,
    setConfigs: newConfigs
  };
};

export const applyLengthToAllSets = (
  event: EventDetails,
  value: number
): EventDetails => {
  const currentConfigs = getEffectiveSetConfigs(event);
  const isTime = event.setLengthType === 'TIME';

  const updatedConfigs = currentConfigs.map(cfg => ({
    ...cfg,
    targetMinutes: isTime ? value : cfg.targetMinutes,
    targetSongs: !isTime ? value : cfg.targetSongs
  }));

  const updatedSets = event.sets?.map(set => ({
    ...set,
    targetMinutes: isTime ? value : set.targetMinutes,
    targetSongs: !isTime ? value : set.targetSongs
  }));

  return {
    ...event,
    minutesPerSet: isTime ? value : event.minutesPerSet,
    songsPerSet: !isTime ? value : event.songsPerSet,
    setConfigs: updatedConfigs,
    sets: updatedSets || event.sets
  };
};

export const calculateTotalStats = (event: EventDetails) => {
  const configs = getEffectiveSetConfigs(event);
  const avgSongMin = event.settings?.avgSongMin || 4;
  const bufferSongs = event.settings?.bufferSongs || 0;

  let totalMinutes = 0;
  let totalEstimatedSongs = 0;

  configs.forEach(cfg => {
    if (event.setLengthType === 'TIME') {
      const mins = cfg.targetMinutes || event.minutesPerSet || 45;
      totalMinutes += mins;
      totalEstimatedSongs += calculateEstimatedSongs(mins, avgSongMin, bufferSongs);
    } else {
      const songs = cfg.targetSongs || event.songsPerSet || 10;
      totalEstimatedSongs += songs;
      totalMinutes += calculateEstimatedMinutes(songs, avgSongMin);
    }
  });

  return { totalMinutes, totalEstimatedSongs, count: configs.length };
};
