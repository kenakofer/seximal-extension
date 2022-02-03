// document.body.style.border = "5px solid red";


// window.findAndReplaceDOMText(document.body, {
//     find: /(^|\s|\(|,)([-+]?(\d*\.)?\d+)([\s\),]|$)/gm,
//     replace: function(portion, match) {
//         return 'XX';
//     }
// });


// There's ambiguity about (100,200)
// is that one number or two? So we probably don't support commas as separators on their own

// const symbol = "ട"
// const symbol = "ˢ"
// const symbol = "₆"
// const symbol = "₍₆₎"
// const symbol = "ۛ"
// const symbol = "〟"
const symbol = "ۖ"

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


        // Output modified text plus the small indicator symbol
        // return output + 'ഗ';
        // return '\<abbr title="' +dec_string + '"\>' + output + 'ഗ\</abbr\>';
        // return 'AOEUSTART' +dec_string + "AOEUMIDDLE" + output + 'AOEUEND';

        return 'AOEUGTabbr title="' +dec_string + '"AOEULT' + output + symbol + 'AOEUGT/abbrAOEULT';
        // ⒮
        // ട
        // ഗ
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
replaceInText(document.body);
// document.body.innerHTML = document.body.innerHTML.replace(/AOEUGT/g, "<").replace(/AOEULT/g, ">");
// document.body.innerHTML = document.body.innerHTML.replace(/AOEUMIDDLE/g, "");
// document.body.innerHTML = document.body.innerHTML.replace(/AOEUEND/g, "</strong>");
        // return 'AOEUSTART' +dec_string + "AOEUMIDDLE" + output + 'AOEUEND';

// window.findAndReplaceDOMText(
//     /(^|\s|\()([-+]?(\d*\.)?\d+)([\s\);]|,(\s|$)|$)/gm,
//     document.body,
//     function(text, index) {
//         var integer = parseInt(text, 10);
//         var float = parseFloat(text, 10);
//         var is_integer = false;
//         var output;
//         if (Math.abs(integer - float) < .0001) {
//             output = integer.toString(6);
//             is_integer = true;
//         } else {
//             output = float.toString(6);
//             if (output.length > text.length) {
//                 output = output.substring(0, text.length);
//             }
//         }

//         // Return the original preemptively:
//         if (is_integer && Math.abs(integer) < 6) return text; // Small integer. Don't modify text at all


//         // Output modified text plus the small indicator symbol
//         return output + 'ഗ';
//         // return '<abbr title="' +text + '">' + output + 'ഗ</abbr>';
//         // ⒮
//         // ട
//         // ഗ
//     },
//     2 // Select the second matching group
// );
