/*!
 * Personal id JavaScript Library
 *
 * Created by Jan Schrøder Hansen
 *
 */
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
			if (birhtdate == undefined) {
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
			var multiply = [4, 3, 2, 7, 6, 5, 4, 3, 2, 1];
			var sum = 0;
			var pos = 0;
			for (i = 0; i < 10; i++) {
				var intValue = parseInt(id.substring(pos, pos + 1));
				sum += intValue * multiply[i];
				if (i == 5) pos++; //Ignore dash
				pos++;
			}
            if (sum % 11 == 0) {
            	modulus11Ok = true;
            }
		}
		return modulus11Ok;
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
		var month = parseInt(id.substring(2, 4) - 1);
		var day = parseInt(id.substring(0, 2));
		return new Date(this.getFullYear(), month, day, 0, 0, 0, 0);
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