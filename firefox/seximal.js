// const symbol = "ട"
// const symbol = "ˢ"
// const symbol = "₆"
// const symbol = "₍₆₎"
// const symbol = "ۛ"
// const symbol = "〟"
const symbol = "ۖ"

const GROUP_SIZE = 4;
const SUBGROUP_SIZE = 2;
const NAME_100 = "nif"
const NAME_0 = "zero"
const NAME_NEGATIVE = "minus"
const NAME_POSITIVE = "plus"

const subgroup_words = {
    "00": "",
    "01": "one",
    "02": "two",
    "03": "three",
    "04": "four",
    "05": "five",
    "10": "six",
    "11": "seven",
    "12": "eight",
    "13": "nine",
    "14": "ten",
    "15": "eleven",
    "20": "dozen",
    "21": "dozen-one",
    "22": "dozen-two",
    "23": "dozen-three",
    "24": "dozen-four",
    "25": "dozen-five",
    "30": "thirsy",
    "31": "thirsy-one",
    "32": "thirsy-two",
    "33": "thirsy-three",
    "34": "thirsy-four",
    "35": "thirsy-five",
    "40": "foursy",
    "41": "foursy-one",
    "42": "foursy-two",
    "43": "foursy-three",
    "44": "foursy-four",
    "45": "foursy-five",
    "50": "fifsy",
    "51": "fifsy-one",
    "52": "fifsy-two",
    "53": "fifsy-three",
    "54": "fifsy-four",
    "55": "fifsy-five",
}

const UNEXIAN_POWER_NAMES = [
    "", // The 0th power is nameless, just like in decimal
    " unexian",
    " biexian",
    " triexian",
    " quadexian",
    " pentexian",
    " unnilexian",
    " ununexian",
    " umbiexian",
    " untriexian",
    " unquadexian",
    " umpentexian"
]

// Accepts a string of length GROUP_SIZE
function get_group_words(seximal_substring) {
    var larger_pair = seximal_substring.substring(0,2);
    var smaller_pair = seximal_substring.substring(2,4);
    var string = ""

    string += subgroup_words[larger_pair];
    if (larger_pair != "00") string += "-" + NAME_100;

    string += " " + subgroup_words[smaller_pair];

    return string.trim();
}

function get_seximal_words_for_seximal_numerals(seximal_string) {
    var parts = seximal_string.split(".");
    var full_name = "";

    // The logic below would return "" for in input of 0, so we special case it.
    if (seximal_string == "0") {
        return NAME_0;
    }
    if (seximal_string.charAt(0) == "-") {
        return NAME_NEGATIVE + " " + get_seximal_words_for_seximal_numerals(seximal_string.substring(1));
    }
    if (seximal_string.charAt(0) == "+") {
        return NAME_POSITION + " " + get_seximal_words_for_seximal_numerals(seximal_string.substring(1));
    }

    // Attempt to grab groups of 4 digits, starting from the right
    var unexian_power = -1;
    for (var substring_end=parts[0].length; substring_end>0; substring_end-=GROUP_SIZE) {
        unexian_power += 1;

        var substring_start = substring_end - GROUP_SIZE;
        if (substring_start < 0) substring_start = 0;

        var substring = parts[0].substring(substring_start, substring_end);
        substring = substring.padStart(GROUP_SIZE, "0");

        // Calculate the group of 4 digits
        var group_name = get_group_words(substring);

        // We want "One biexian one", not "One biexian unexian one". Nor do we
        // want spaces or other separator-y things
        if (group_name == "") continue;

        // Add the correct power name. For seximal 5555 and below, this will be empty.
        group_name += UNEXIAN_POWER_NAMES[unexian_power];

        //Space between this group and previously added groups
        if (full_name != "")
            group_name += " ";

        full_name = group_name + full_name; // We're adding the group names from right to left
    }

    return full_name;
}

function process_decimal_to_seximal(dec_string) {
        var integer = parseInt(dec_string, 10);
        var float = parseFloat(dec_string, 10);
        var is_integer = false;
        var output;
        if (Math.abs(integer - float) < .0001) {
            output = integer.toString(6);
            is_integer = true;
        } else {
            output = float.toString(6);
            if (output.length > dec_string.length) {
                output = output.substring(0, dec_string.length);
            }
        }

        // Return the original preemptively:
        if (is_integer && Math.abs(integer) < 6) return dec_string; // Small integer. Don't modify dec_string at all

        return 'AOEUGTabbr title="' +
            get_seximal_words_for_seximal_numerals(output) +
            ' (Decimal '+dec_string + ')"AOEULT' +
            output + symbol +
            'AOEUGT/abbrAOEULT';
};

function replaceInText(element) {
    var changed = false;
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                replaceInText(node);
                break;
            case Node.TEXT_NODE:
                node.textContent = node.textContent.replace(

                    // There's ambiguity about (100,200) is that one number or
                    // two? So we probably don't support commas as separators on
                    // their own
                    /(^|\s|\()([-+]?(\d*\.)?\d+)([\s\);]|,(\s|$)|$)/gm,

                    // Here's the question that helped: https://stackoverflow.com/questions/7192436/javascript-passing-a-function-with-matches-to-replace-regex-funcarg-doesn/7193481
                    // "$1$2$4" is the original
                    function (full_match, cap_before, cap_num, _, cap_after, _) {
                        changed = true;
                        return cap_before + process_decimal_to_seximal(cap_num) + cap_after;
                    }
                    //Convert number
                );
                // var template = document.createElement('template');
                // template.innerHTML = node.innerHTML;
                // node.parentNode.insertBefore(template, node);
                // node.parentNode.removeChild(node);
                break;
            case Node.DOCUMENT_NODE:
                replaceInText(node);
        }
    }
    if (changed) {
        element.parentElement.innerHTML = element.parentElement.innerHTML.replace(/AOEUGT/g, "<").replace(/AOEULT/g, ">");
    }
}

replaceInText(document.body);
replaceInText(document.body); // The first run sometimes missed stuff.
