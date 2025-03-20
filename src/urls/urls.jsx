const API_Base_url =
  process.env.REACT_APP_API_BASE_URL || "https://serversabac-382170497486.us-central1.run.app";

  const urls ={
    login : `${API_Base_url}/login/`,
    salerRegister: `${API_Base_url}/saler_register/`,
    listOfAllCars: `${API_Base_url}/get_cars_list/`,
    refreshToken : `${API_Base_url}/token/refresh/`,
    postCarDetails : `${API_Base_url}/add_car_details/`,
    carphoto: `${API_Base_url}/saler_car_photos/`,
    salerCarList : `${API_Base_url}/get_car_details/`,
    salerRecentCarDetails: `${API_Base_url}/get_last_car_details/`,
    listofcarsforinspection: `${API_Base_url}/get_list_of_car_for_inspection/`,
    inspectorsList : `${API_Base_url}/get_inspectors/`,
    addAvailability : `${API_Base_url}/add_availability/`, //inspector adds its time slot and date
    getfreeslots: `${API_Base_url}/get_free_slots/`,
    selectSlot : `${API_Base_url}/select_slot/`,
    salerAppointments : `${API_Base_url}/saler_appointmet/`,
    inspectorAppointment: `${API_Base_url}/inspector_appointments/`,
    assignSlot:`${API_Base_url}/assign_slot/`,
    getAssignedSlot : `${API_Base_url}/get_assigned_slots/`,
    postInspectionreport : `${API_Base_url}/post_inspection_report/`,
    inspectorGetsAppointmentNotification : `${API_Base_url}/get_seller_appointment_notification/`,
    markNotificationAsRead : `${API_Base_url}/mark_notifications_as_read/`,
    additionalDetails : `${API_Base_url}/post_additional_details/`,
    userCarList : `${API_Base_url}/get_user_cars/`,
    updateCarStatus: (carId) => `${API_Base_url}/update_status/${carId}/`, // Update car status on seller dashboard
    salerCarInspectionNotification : `${API_Base_url}/inspection-notifications/`,
    getCarsWithStatusBidding : `${API_Base_url}/get_bidding_cars/`, // for deal list for car with bidding status
    getInspectionReport : `${API_Base_url}/get_inspection_report/`,
    getUpcomingCars : `${API_Base_url}/get_upcoming_cars/`, //upcoming cars for dealer upcoming section
    getCarsForApproval :`${API_Base_url}/get_cars_for_approval/`, //cars for admin dashboard status awaiting_approval
    postBid : `${API_Base_url}/place_bid/`, //dealer post bid
    BidNotifForSeller : `${API_Base_url}/Bid_notification_for_seller/`, //bid notification for seller
    markBidNotifRead : `${API_Base_url}/mark_bid_notifications_as_read/`,
    acceptBid : `${API_Base_url}/accept_bid/`,
    rejectBid : `${API_Base_url}/reject_bid/`,
    postGuestDetail : `${API_Base_url}/post_guest_details/`,//guest post its information
    guestAddCarDetail : `${API_Base_url}/guest_add_car_details/`, //guet add post of car
    guestCarListForInspector : `${API_Base_url}/get_guest_car_details/`, //list of cars of guest for inspector
    linkInspectorAndGuestCar : `${API_Base_url}/assign_inspector_to_car/`, //car and inspector linked
    linkInspectorAndSellerCar : `${API_Base_url}/assign-inspector-to-seller-car/`, //car and inspector linked
    sellerManualEntries :`${API_Base_url}/seller_manual_entries/`



  }

  export default urls