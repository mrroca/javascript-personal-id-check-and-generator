/*!
 * Personal id JavaScript Library
 *
 * Created by Jan Schrøder Hansen
 *
 */
function calculateModules11(id, to) {
	var multiply = [4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
	var sum = 0;
	var pos = 0;
	for (i = 0; i < to; i++) {
		var x = id.substring(pos, pos + 1);
		var intValue = parseInt(x);
		sum += intValue * multiply[i];
		if (i == 5) pos++; //Ignore dash
		pos++;
	}
	return sum;
}


function TestDKPersonalId(id) {
	this.id = id;
	
	this.getResultAsHtml = function() {
		var returnHtml = "";
		var errorFound = false;
		if (!this.formatValidation()) {
			errorFound = true;
			returnHtml += "<li>Format fejl: DDMMYY-XXXY</li>";
			returnHtml += "<ul>";
			returnHtml += "<li>DDMMYY = fødselsdag</li>";
			returnHtml += "<li>XXX = løbenummer m.m.</li>";
			returnHtml += "<li>Y = modulus 11 check.</li>";
			returnHtml += "</ul>";
		}
		else {
			if (!this.modulus11Validation()) {
				errorFound = true;
				returnHtml += "<li>Modulus 11 fejl</li>";
			}
			var birhtdate = this.getBirthDate();
			if (birhtdate == null) {
				errorFound = true;
				returnHtml += "<li>Ikke gyldig fødselsdag</li>";
			}
		}
		if (errorFound) {
			return "Følgende fejl er fundet:<br /><ul>" + returnHtml + "</ul>";
		}
		else {
			var okReturnHtml = "";
			okReturnHtml += "<b>Ok!</b><br/>";
			okReturnHtml += "<ul>";
			okReturnHtml += "<li>Født: " + this.getBirthDate().toLocaleDateString() + "</li>";
			var gender = this.getGender();
			if (gender === "MALE") {
				okReturnHtml += "<li>Køn: Mand</li>";
			}
			else {
				okReturnHtml += "<li>Køn: Kvinde</li>";
			}
			if (this.noModulus11Validation()) {
				okReturnHtml += "<li>Modulus 11 kontrol, kan ikke benyttes for denne fødselsdag.</li>";
			}
			okReturnHtml += "</ul>";
			return okReturnHtml;
		}
	};
	
	this.formatValidation = function() {
		var re = new RegExp("^(((0|1|2)[0-9])|(3[0-1]))((0[1-9])|(1[0-2]))[0-9]{2}-[0-9]{4}$");
		if (id.match(re)) {
			return true;
		}
		else {
			return false;
		}
	};
	
	this.modulus11Validation = function() {
		var modulus11Ok = false;
		if (id.length == 11) {
			if (this.noModulus11Validation()) {
				return true;
			}
			else {
				var sum = calculateModules11(id, 10);
	            if (sum % 11 == 0) {
	            	modulus11Ok = true;
	            }
			}
		}
		return modulus11Ok;
	};
	
	this.noModulus11Validation = function() {
		var birthdate = this.getBirthDate();
		var gender = this.getGender();
		if (birthdate != null) {
			var noModulusOn01011965 = $.datepicker.parseDate('ddmmyy', '01011965'); 
			if (birthdate.getTime() == noModulusOn01011965.getTime() && gender === "MALE") {
				return true;
			}
			var noModulusOn01011966 = $.datepicker.parseDate('ddmmyy', '01011966'); 
			if (birthdate.getTime() == noModulusOn01011966.getTime() && gender === "MALE") {
				return true;
			}
		}
		return false;
	};
	
	this.getFullYear = function() {
		var year = parseInt(id.substring(4, 6));
		var digit8 = parseInt(id.substring(7, 8));
		var fullYear = 0;
        switch (digit8)
        {
            case 0:
            case 1:
            case 2:
            case 3:
                fullYear = 1900 + year;                       
                break;
            case 4:
                if (year < 37)
                {
                    fullYear = 2000 + year;
                }
                else
                {
                    fullYear = 1900 + year;
                }
                break;
            case 5:
            case 6:
            case 7:
            case 8:
                if (year > 57)
                {
                    fullYear = 1800 + year;
                }
                else
                {
                    fullYear = 2000 + year;
                }
                break;
            case 9:
                if (year > 36)
                {
                    fullYear = 1900 + year;
                }
                else
                {
                    fullYear = 2000 + year;
                }
                break;
        }
        return fullYear;
	};
	
	this.getBirthDate = function() {
		var str = id.substring(0, 4) + this.getFullYear();
		try {
			return $.datepicker.parseDate('ddmmyy', str);
		}
		catch (er) {
			return null;
		}
	};
	
	this.getGender = function() {
		var digit11 = parseInt(id.substring(10, 11));
		var x = digit11 % 2;
		if (x === 0) {
			return "FEMALE";
		}
		else {
			return "MALE";
		}
	};
}

function GenerateDKPersonalIds(gender, birthdate) {
	this.gender = gender;
	this.birthdate = birthdate;
	
	this.getResultAsHtml = function() {
		return this.generate();
	};
	
	this.generate = function() {
		var fixpart = "";
		var day = birthdate.getDate();
		if (day < 10) fixpart += "0";
		fixpart += day;
		var month = birthdate.getMonth() + 1;
		if (month < 10) fixpart += "0";
		fixpart += month;
		var fullYear = birthdate.getFullYear();
		var strYear = "" + fullYear;
		fixpart += strYear.substring(2, 4);
		fixpart += "-"; 
		
		var result = "";
		var valid8Digits = this.getValid8Digits(fullYear);
		var addComma = false;
		
		for(var next8Digit = 0; next8Digit < valid8Digits.length; next8Digit++) {
			for (var nextSerialNumber = 0; nextSerialNumber <= 99; nextSerialNumber++) {
				var nextId = fixpart;
				nextId += valid8Digits[next8Digit];
				if (nextSerialNumber < 10) nextId += "0";
				nextId += nextSerialNumber;
				var sum = calculateModules11(nextId, 9);
	            var remainder = sum % 11;
	            var modulus11 = 0;
	            if (remainder != 0) modulus11 = 11 - remainder;
				if (modulus11 < 10) {
					nextId += modulus11;
					if (modulus11 % 2 == 0 && gender === "FEMALE") {
						if (addComma) result += ", ";
						result += nextId;
						addComma = true;
					}
					else if (modulus11 % 2 != 0 && gender === "MALE") {
						if (addComma) result += ", ";
						result += nextId;
						addComma = true;
					}
 				}
			}
		}
		return result;
	};
	
	this.getValid8Digits = function(fullYear) {
		var century = Math.floor(fullYear / 100);
		var year = fullYear % 100;
		var valid8Digits = [];
		var nextElement = 0;

        if (century == 19)
        {
            valid8Digits[nextElement++] = 0;
            valid8Digits[nextElement++] = 1;
            valid8Digits[nextElement++] = 2;
            valid8Digits[nextElement++] = 3;
            if (year >= 37)
            {
            	valid8Digits[nextElement++] = 4;
            	valid8Digits[nextElement++] = 9;
            }
        }
        else if (century == 20)
        {
            if (year < 37)
            {
            	valid8Digits[nextElement++] = 4;
            }
            if (year <= 57)
            {
            	valid8Digits[nextElement++] = 5;
            	valid8Digits[nextElement++] = 6;
            	valid8Digits[nextElement++] = 7;
            	valid8Digits[nextElement++] = 8;
            }
            if (year <= 36) valid8Digits[nextElement++] = 9;
        }
        else if (century == 1800)
        {
            if (year > 57)
            {
            	valid8Digits[nextElement++] = 5;
            	valid8Digits[nextElement++] = 6;
            	valid8Digits[nextElement++] = 7;
            	valid8Digits[nextElement++] = 8;
            }
        }
        return valid8Digits;
	};
}

function testPersonalId(id, country) {
	switch (country) {
		case "dk":
			var dkTester = new TestDKPersonalId(id);
			return dkTester.getResultAsHtml();
			break;
		case "se":
			return "Sverige virker <b>ikke</b> endnu.";
			break;
		default:
			return "Kun danske og svenske person id'er kan testes.";
	}
}

function generatePersonalIds(country, gender, birthdate) {
	switch (country) {
	case "dk":
		var dkGenerator = new GenerateDKPersonalIds(gender, birthdate);
		return dkGenerator.getResultAsHtml();
		break;
	case "se":
		return "Sverige virker <b>ikke</b> endnu.";
		break;
	default:
		return "Kun danske og svenske person id'er kan genereres.";
	}
}