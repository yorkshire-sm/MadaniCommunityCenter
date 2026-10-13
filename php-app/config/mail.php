<?php
/**
 * Email Notification Service
 * Sends automated booking acknowledgements, approval confirmations, and cancellation notices.
 * 
 * Works out-of-the-box with standard PHP mail() on IONOS hosting.
 * Can be extended to PHPMailer or SMTP if authenticated delivery is configured.
 */

function send_booking_acknowledgement_email(array $booking, string $customer_email, string $customer_name): bool {
    $subject = "Booking Request Acknowledged - Madani Community Center (Ref: {$booking['reference']})";
    
    $message = "Dear {$customer_name},\n\n"
        . "Thank you for requesting to hire facilities at Madani Community Center, Sheffield.\n\n"
        . "BOOKING SUMMARY:\n"
        . "----------------------------------------\n"
        . "Reference Code: {$booking['reference']}\n"
        . "Facility:       {$booking['facility_name']}\n"
        . "Date:           {$booking['booking_date']}\n"
        . "Time Slot:      {$booking['start_time']} - {$booking['finish_time']} ({$booking['duration_hours']} hours)\n"
        . "Attendees:      {$booking['attendees']}\n"
        . "Estimated Fee:  £{$booking['total_cost']}\n"
        . "Current Status: PENDING APPROVAL\n"
        . "----------------------------------------\n\n"
        . "NEXT STEPS:\n"
        . "All new reservations are submitted as Pending Approval to prevent scheduling conflicts.\n"
        . "Our facility coordinator will review your request within 24-48 hours and contact you with confirmation and deposit instructions.\n\n"
        . "Please note that Madani Community Center operates a strictly alcohol-free and respectful community ethos.\n\n"
        . "Kind regards,\n"
        . "Bookings Team\n"
        . "Madani Community Center\n"
        . "Tinsley Park Road, Sheffield, S9 5DL\n"
        . "Email: venuehire@madanicenter.org.uk\n";

    return send_system_email($customer_email, $subject, $message);
}

function send_booking_approval_email(array $booking, string $customer_email, string $customer_name): bool {
    $subject = "CONFIRMED: Your Booking at Madani Community Center (Ref: {$booking['reference']})";

    $message = "Dear {$customer_name},\n\n"
        . "We are pleased to inform you that your booking request has been CONFIRMED by the administration.\n\n"
        . "CONFIRMED DETAILS:\n"
        . "----------------------------------------\n"
        . "Reference Code: {$booking['reference']}\n"
        . "Facility:       {$booking['facility_name']}\n"
        . "Date:           {$booking['booking_date']}\n"
        . "Time:           {$booking['start_time']} to {$booking['finish_time']}\n"
        . "Total Due:      £{$booking['total_cost']}\n"
        . "Deposit Bond:   £{$booking['deposit_required']}\n"
        . "----------------------------------------\n\n"
        . "Your reservation is now secured on our center calendar.\n"
        . "Our team will reach out regarding keyholder coordination and building access arrangements.\n\n"
        . "Kind regards,\n"
        . "Facility Manager\n"
        . "Madani Community Center\n"
        . "Sheffield, S9 5DL\n";

    return send_system_email($customer_email, $subject, $message);
}

function send_booking_rejection_email(array $booking, string $customer_email, string $customer_name, string $reason): bool {
    $subject = "Update regarding your booking request (Ref: {$booking['reference']})";

    $message = "Dear {$customer_name},\n\n"
        . "Thank you for your interest in hiring spaces at Madani Community Center.\n\n"
        . "Unfortunately, we are unable to accommodate your booking request for {$booking['booking_date']} ({$booking['facility_name']}).\n\n"
        . "REASON:\n"
        . "{$reason}\n\n"
        . "You are welcome to submit an alternative date or contact our team directly at venuehire@madanicenter.org.uk to discuss availability.\n\n"
        . "Kind regards,\n"
        . "Bookings Team\n"
        . "Madani Community Center\n";

    return send_system_email($customer_email, $subject, $message);
}

function send_system_email(string $to, string $subject, string $body): bool {
    $sender = getenv('MAIL_FROM') ?: 'no-reply@madanicenter.org.uk';
    $headers = [
        'From' => "Madani Community Center <{$sender}>",
        'Reply-To' => 'venuehire@madanicenter.org.uk',
        'X-Mailer' => 'PHP/' . phpversion(),
        'Content-Type' => 'text/plain; charset=UTF-8',
    ];

    $headers_str = '';
    foreach ($headers as $k => $v) {
        $headers_str .= "{$k}: {$v}\r\n";
    }

    // Suppress warning if local mail server is not configured, record in log
    $sent = @mail($to, $subject, $body, $headers_str);
    if (!$sent) {
        error_log("Email dispatch simulated/logged for: {$to} | Subject: {$subject}");
    }
    return $sent;
}
