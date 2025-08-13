export const cardValidation = {
  // Luhn algorithm for card number validation
  luhnCheck: (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\D/g, "").split("").map(Number)
    let sum = 0
    let isEven = false

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i]

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  },

  // Detect card type based on number patterns
  getCardType: (cardNumber: string): { type: string; icon: string; color: string } => {
    
    const number = cardNumber.replace(/\D/g, "")

    if (/^4/.test(number)) {
      return { type: "Visa", icon: "vis.svg", color: "text-blue-600" }
    } else if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) {
      return { type: "Mastercard", icon: "mas.svg", color: "text-red-600" }
    } else if (/^3[47]/.test(number)) {
      return { type: "American Express", icon: "💳", color: "text-green-600" }
    } else if (/^6/.test(number)) {
      return { type: "Discover", icon: "💳", color: "text-orange-600" }
    }

    return { type: "Unknown", icon: "💳", color: "text-gray-600" }
  },

  // Format card number with spaces
  formatCardNumber: (value: string): string => {
    const number = value.replace(/\D/g, "")
    const groups = number.match(/.{1,4}/g) || []
    return groups.join(" ").substr(0, 19) // Max 16 digits + 3 spaces
  },

  // Validate expiry date
  validateExpiry: (month: string, year: string): boolean => {
    if (!month || !year) return false

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1

    const expMonth = Number.parseInt(month)
    const expYear = Number.parseInt(year)

    if (expYear < currentYear) return false
    if (expYear === currentYear && expMonth < currentMonth) return false

    return true
  },

  // Validate CVV based on card type
  validateCVV: (cvv: string, cardType: string): boolean => {
    if (cardType === "American Express") {
      return /^\d{4}$/.test(cvv)
    }
    return /^\d{3}$/.test(cvv)
  },
}
