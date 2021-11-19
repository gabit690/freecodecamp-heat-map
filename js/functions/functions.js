export default {
    numberToMonth: (number) => {
        if(isNaN(number) || number < 1 || number > 12)
            return "";
        let months = [
            "january", 
            "february", 
            "march",
            "april", 
            "may", 
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december"
        ];
        return months[number - 1];
    }
}