import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PendingAppointment {
    barber: string;
    services: any;
    status: string
}

interface PendingAppointmentState {
    pendingAppointment: PendingAppointment | null
}

const initialState: PendingAppointmentState = {
    pendingAppointment: null
}

const pendingAppointmentSlice = createSlice({
    name: 'pendingAppointment',
    initialState,
    reducers: {
        setPendingAppointment(state, action: PayloadAction<PendingAppointment | null>) {
            state.pendingAppointment = action.payload
        },
        removePendingAppointment(state) {
            state.pendingAppointment = null
        },
        updatePendingAppointment(state, action: PayloadAction<PendingAppointment | null>) {
            if (state.pendingAppointment) {
                const index = state.pendingAppointment?.services.findIndex(
                    (service: any) => service.serviceName == action?.payload?.services[0].serviceName
                )
                if (index !== -1) {
                    state.pendingAppointment.services[index] = action?.payload?.services[0]
                }
            }
        },
        deletePendingAppointmentsItem(state, action: PayloadAction<any>) {
            const { name, price, serviceName } = action.payload;

            // Ensure pendingAppointment exists before modifying services
            if (state.pendingAppointment) {
                state.pendingAppointment.services = state.pendingAppointment.services.filter(
                    (service: any) =>
                        service.name !== name ||
                        service.price !== price ||
                        service.serviceName !== serviceName
                );
            }
        }
    }
})

export const { setPendingAppointment, removePendingAppointment, updatePendingAppointment , deletePendingAppointmentsItem } = pendingAppointmentSlice.actions;

export const selectPendingAppointment = (state: { pendingAppointment: PendingAppointmentState }) => state.pendingAppointment.pendingAppointment

export default pendingAppointmentSlice.reducer
