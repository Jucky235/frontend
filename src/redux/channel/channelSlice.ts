import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Channel, channelApiSlice } from "./channelApiSlice";

interface ChannelState {
  activeChannelId: string | null;
  activeChannel: Channel | null;
  searchFilter: string;
}

const initialState: ChannelState = {
  activeChannelId: null,
  activeChannel: null,
  searchFilter: "",
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    // Select a channel manually by ID or entity
    setActiveChannel: (state, action: PayloadAction<Channel>) => {
      state.activeChannelId = action.payload.id;
      state.activeChannel = action.payload;
    },
    setActiveChannelId: (state, action: PayloadAction<string | null>) => {
      state.activeChannelId = action.payload;
      if (!action.payload) {
        state.activeChannel = null;
      }
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.searchFilter = action.payload;
    },
    resetChannelState: () => {
      return initialState;
    },
  },
  // Automatically mirror RTK Query query results into local Redux state
  extraReducers: (builder) => {
    builder
      // Auto-select the first channel from the list if no active channel is selected
      .addMatcher(
        channelApiSlice.endpoints.getAllChannels.matchFulfilled,
        (state, action) => {
          const channels = action.payload.data;
          if (channels.length > 0 && !state.activeChannelId) {
            state.activeChannelId = channels[0].id;
            state.activeChannel = channels[0];
          }
        },
      )
      // Sync detailed channel info when fetched by ID
      .addMatcher(
        channelApiSlice.endpoints.getChannelById.matchFulfilled,
        (state, action) => {
          state.activeChannel = action.payload.data;
          state.activeChannelId = action.payload.data.id;
        },
      );
  },
});

export const {
  setActiveChannel,
  setActiveChannelId,
  setSearchFilter,
  resetChannelState,
} = channelSlice.actions;

export default channelSlice.reducer;

// Selectors
export const selectActiveChannelId = (state: any) =>
  state.channel.activeChannelId;
export const selectActiveChannel = (state: any) => state.channel.activeChannel;
export const selectChannelSearchFilter = (state: any) =>
  state.channel.searchFilter;
