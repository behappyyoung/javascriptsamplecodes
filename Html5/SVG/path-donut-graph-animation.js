        function calcPath (value, total, R) {
            var center;
            var alpha = 360 / total * value,
                    a = (90 - alpha) * Math.PI / 180,
                     x = 80 + R * Math.cos(a),
                    y = 80 - R * Math.sin(a),
                    path;
            if (total == value) {
                path = "M"+ 70 +","+ (90 - R) +" A"+ R+","+ R+","+ 0+","+ 1+","+ 1+","+ 69.99+","+ 70 - R;
            } else {
                if(alpha > 180) {
                    center = 1;
                } else {
                    center = 0;
                }
                path = "M"+ 80+","+ (80 - R) +" A"+ R+","+ R+","+ 0+"," + center +","+ 1+","+ x+","+ y;
            }

            return path;
        }

        function calcPath3 (value, total, R) {
            var center;
            var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x = 80 + R * Math.cos(a),
                y = 80 - R * Math.sin(a),
                path;
            if (total == value) {
                path = "M"+ 70 +","+ (90 - R) +" A"+ R+","+ R+","+ 0+","+ 1+","+ 1+","+ 69.99+","+ 70 - R;
            } else {
                if(alpha > 180) {
                    center = 1;
                } else {
                    center = 0;
                }
                path = "M"+ 80+","+ (80 - R) +" A"+ R+","+ R+","+ 0+"," + center +","+ 1+","+ x+","+ y;
            }
            return path;
        }


        function updatePath(progress_id,  value, total, color){
            if(value<total){
                path = calcPath(value, total, 70);
            }else{
                path = calcPath(total-0.1, total, 70);
            }
            $('#progress_'+progress_id).html('<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' +
                '<path d="M10,80 A70,70 0 1,0  10,79.999"   fill="none" stroke="#DFDFDF" stroke-width="10" /> ' +
                '<path d="'+path+'"   fill="none" stroke="'+color+'" stroke-linejoin="round"   stroke-width="10" stroke-dasharray="10,2"/> </svg>');
            $('#pathlog_'+progress_id).html($('#pathlog_'+progress_id).html() + '<br /> '+ path);
            $('#actual_'+progress_id).html(Number(value/total * 100).toFixed(0));

        }


        function updatePath2(progress_id,  value, total, color){
            if(value<total){
                path = calcPath3(value, total, 60);
            }else{
                path = calcPath3(total-0.1, total, 60);
            }
            $('#progress_'+progress_id).html('<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' +
                '<path d="M80,20 A60,60 0 1,1  79.99,20"   fill="#ff4444" stroke="#DFDFDF" stroke-width="20" />' +
                ' <path d="'+path+'"   fill="none" stroke="'+color+'" stroke-linejoin="round"   stroke-width="20" stroke-dasharray="10,2"/> </svg>');

            $('#pathlog_'+progress_id).html($('#pathlog_'+progress_id).html() + '<br /> '+ path);
            $('#actual_'+progress_id).html(Number(value/total * 100).toFixed(0));

        }



        jQuery(document).ready(function() {

            var my_value=0;
            var my_value2=0;
            var actual_1 = 150;
            var actual_2 = 180;
            var my_intvar = setInterval(myUpdate, 200);
            var my_intvar2 = setInterval(myUpdate2, 200);

            function myUpdate(){
                my_value = my_value +10;
                updatePath(1, Number(my_value).toFixed(2), 200, '#FF7DC0');
                if(my_value>actual_1){
                    clearInterval(my_intvar);
                    updatePath(1, actual_1, 200, '#007DC0');
                }
            }

            function myUpdate2(){
                my_value2 = my_value2 +10;
                updatePath2(2, Number(my_value2).toFixed(2), 200, '#FF7DC0');
                if(my_value2>actual_2){
                    clearInterval(my_intvar2);
                    updatePath2(2, actual_2, 200, '#007DC0');
                }
            }

        });