/**
 * KLM:
 * @param: easyJet booking reference: K55ZWNV
 * @param: "confirmation@easyJet.com" <donotreply@easyjet.com>
 **/
export function isEasyJetEmailConfirmation(emailSubject: string, emailFrom: string): boolean {
    return emailSubject.startsWith("easyJet booking reference:") && emailFrom === '"confirmation@easyJet.com" <donotreply@easyjet.com>';
}
  
/**
 * KLM:
 * @param: Confirmation: Berlin - Cancun (QHDHH5)
 * @param: KLM Reservations <noreply@klm.com>
 **/
export function isKlmEmailConfirmation(emailSubject: string, emailFrom: string): boolean {
    return emailSubject.startsWith("Confirmation:") && emailFrom === "KLM Reservations <noreply@klm.com>";
}

/**
 * Lufthansa:
 * @param: Confirmation: Berlin - Cancun (QHDHH5)
 * @param: KLM Reservations <noreply@klm.com>
 **/
export function isLufthansaEmailConfirmation(emailSubject: string, emailFrom: string): boolean {
    return emailSubject.startsWith("Booking details") && emailFrom === "lufthansa.com <online@booking.lufthansa.com>";
}