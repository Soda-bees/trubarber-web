import io from 'socket.io-client'
import { acceptAppointment, addAndUpdateNewChatInRedux, addAppoinment, addMessageInChatRoom, addNewChatInRedux, addNewNotificationRedux, addReview, deleteReview, updateAppointmendStatus, updateReview } from '../../../Store/userDataSlice';
const baseURL = process.env.REACT_APP_API_URL || ''

let socket: any

const connectSocket = () => {
    if (!baseURL) {
        throw new Error("REACT_APP_API_URL is not defined in socket");
    }

    if (!socket) {
        socket = io(baseURL)
        socket.on('connect', () => {
            console.log('connected to server');

        })
    }
}

const socketService = (dispatch: any, authToken: any, userData: any) => {
    connectSocket()

    const handleReceivedNewAppoinment = (data: any) => {
        dispatch(addAppoinment(data));
    };

    const handleUpdateAppointmendStatus = (data: any) => {
        dispatch(updateAppointmendStatus(data));
    };

    const handleAddNewMessage = async (data: any) => {
        dispatch(addMessageInChatRoom(data));
    };

    const handleAddNewChatRoom = async (data: any) => {
        dispatch(addNewChatInRedux(data));
    };

    const handleAddAndUpdateNewChat = async (data: any) => {
        dispatch(addAndUpdateNewChatInRedux(data));
    };

    const handleAddNewReview = (data: any) => {
        dispatch(addReview(data));
    };
    const handleUpdateReview = (data: any) => {
        console.log('data', data);
        
        dispatch(updateReview(data));
    };
    const handleDeleteReview = (data: any) => {
        dispatch(deleteReview(data));
    };

    const handleNewNotification = (data: any) => {
        dispatch(addNewNotificationRedux(data));
    };

    const handleAppointmentAccepted = (data: any) => {
        dispatch(acceptAppointment(data));
    };


    socket.on('newAppoinment', handleReceivedNewAppoinment);
    socket.on('appointmentStatusUpdate', handleUpdateAppointmendStatus);
    socket.on('newMessage', handleAddNewMessage);
    socket.on('newChatRoom', handleAddNewChatRoom);
    socket.on('existingChatRoomUpdate', handleAddAndUpdateNewChat);
    socket.on('newReview', handleAddNewReview);
    socket.on('updateReview', handleUpdateReview);
    socket.on('deleteReview', handleDeleteReview);
    socket.on('newNotification', handleNewNotification);
    socket.on('appointmentAccepted', handleAppointmentAccepted);

    const cleanup = () => {
        socket.off('newAppoinment', handleReceivedNewAppoinment);
        socket.off('appointmentStatusUpdate', handleUpdateAppointmendStatus);
        socket.off('newMessage', handleAddNewMessage);
        socket.off('newChatRoom', handleAddNewChatRoom);
        socket.off('existingChatRoomUpdate', handleAddAndUpdateNewChat);
        socket.off('newReview', handleAddNewReview);
        socket.off('updateReview', handleUpdateReview);
        socket.off('deleteReview', handleDeleteReview);
        socket.off('newNotification', handleNewNotification);
        socket.off('appointmentAccepted', handleAppointmentAccepted);
    }

    return cleanup;
}

export { socket, socketService }