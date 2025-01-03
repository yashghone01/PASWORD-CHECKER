// DOM Elements
const pass = document.getElementById("password");
const strengthIndicator = document.getElementById("strength-indicator");
const requirements = document.getElementById("requirements");
const arrow = document.querySelector("button[type='submit']");
const togglePassword = document.getElementById("togglePassword");

// Get all requirement elements
const reqLength = document.getElementById("req-length");
const reqUppercase = document.getElementById("req-uppercase");
const reqLowercase = document.getElementById("req-lowercase");
const reqNumber = document.getElementById("req-number");
const reqSpecial = document.getElementById("req-special");
const reqPattern = document.getElementById("req-pattern");
const reqRepeat = document.getElementById("req-repeat");

// Password validation criteria
const criteria = {
    length: 6,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumbers: /\d/,
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
    hasCommonPatterns: /(123|abc|qwerty|password|admin|letmein|welcome)/i,
    hasRepeatingChars: /(.)\1{2,}/
};

// Update requirement status
function updateRequirement(element, isValid) {
    if (element) {
        element.classList.remove(isValid ? 'invalid' : 'valid');
        element.classList.add(isValid ? 'valid' : 'invalid');
        element.innerHTML = `${isValid ? '✅' : '❌'} ${element.innerHTML.split(' ').slice(1).join(' ')}`;
    }
    return isValid;
}

// Check password strength
function checkPasswordStrength(password) {
    let score = 0;
    let allRequirementsMet = true;

    // Check each requirement and update UI
    const lengthValid = updateRequirement(reqLength, password.length >= criteria.length);
    const upperValid = updateRequirement(reqUppercase, criteria.hasUpperCase.test(password));
    const lowerValid = updateRequirement(reqLowercase, criteria.hasLowerCase.test(password));
    const numberValid = updateRequirement(reqNumber, criteria.hasNumbers.test(password));
    const specialValid = updateRequirement(reqSpecial, criteria.hasSpecialChar.test(password));
    const noCommonPatterns = updateRequirement(reqPattern, !criteria.hasCommonPatterns.test(password));
    const noRepeatingChars = updateRequirement(reqRepeat, !criteria.hasRepeatingChars.test(password));

    // Calculate if all requirements are met
    allRequirementsMet = lengthValid && upperValid && lowerValid && 
                        numberValid && specialValid && noCommonPatterns && noRepeatingChars;

    // Calculate score
    if (lengthValid) score += 25;
    if (upperValid) score += 15;
    if (lowerValid) score += 15;
    if (numberValid) score += 15;
    if (specialValid) score += 15;
    if (!noCommonPatterns) score -= 25;
    if (!noRepeatingChars) score -= 15;

    // Ensure score stays within 0-100 range
    score = Math.max(0, Math.min(100, score));

    return { score, allRequirementsMet };
}

// Toggle password visibility
togglePassword.addEventListener("click", function() {
    const isPassword = pass.type === "password";
    pass.type = isPassword ? "text" : "password";
    
    const eyeIconHtml = isPassword ? `
        <svg class="eye-icon" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ` : `
        <svg class="eye-icon" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    this.innerHTML = eyeIconHtml;
});

// Input handler for real-time feedback
pass.addEventListener("input", () => {
    if (pass.value.length > 0) {
        requirements.style.display = "block";
        const { score, allRequirementsMet } = checkPasswordStrength(pass.value);
        
        // Update strength message and colors
        if (score < 50) {
            strengthIndicator.innerHTML = "Password is Weak";
            pass.style.borderColor = "#ff5925";
            strengthIndicator.style.color = "#ff5925";
        } else if (score < 80) {
            strengthIndicator.innerHTML = "Password is Medium";
            pass.style.borderColor = "#ffd700";
            strengthIndicator.style.color = "#ffd700";
        } else {
            strengthIndicator.innerHTML = "Password is Strong";
            pass.style.borderColor = "#26d730";
            strengthIndicator.style.color = "#26d730";
        }

        // Update submit button state
        arrow.style.opacity = allRequirementsMet ? "1" : "0.5";
        arrow.style.cursor = allRequirementsMet ? "pointer" : "not-allowed";
        arrow.disabled = !allRequirementsMet;
    } else {
        requirements.style.display = "none";
        strengthIndicator.innerHTML = "";
        pass.style.borderColor = "transparent";
        arrow.style.opacity = "0.5";
        arrow.style.cursor = "not-allowed";
        arrow.disabled = true;
    }
});

// Add submit button functionality
arrow.addEventListener("click", (e) => {
    e.preventDefault();
    if (!arrow.disabled) {
        console.log("Password submitted successfully!");
        alert("Password meets all requirements and has been submitted!");
        // Reset form after submission
        pass.value = "";
        requirements.style.display = "none";
        strengthIndicator.innerHTML = "";
        pass.style.borderColor = "transparent";
        arrow.style.opacity = "0.5";
        arrow.style.cursor = "not-allowed";
        arrow.disabled = true;
    }
});

// Initialize button state
arrow.style.opacity = "0.5";
arrow.style.cursor = "not-allowed";
arrow.disabled = true;