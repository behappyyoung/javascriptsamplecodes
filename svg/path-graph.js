        function calcPath (value, total, R) {
            var center;
            var alpha = 180 / total * value,
                    a = (90 - alpha) * Math.PI / 180,
                     x = 70 + R * Math.cos(a),
                    y = 70 - R * Math.sin(a),
                    path;
            if (total == value) {
                path = "M"+ 70 +","+ (70 - R) +" A"+ R+","+ R+","+ 0+","+ 1+","+ 1+","+ 69.99+","+ 70 - R;
            } else {
                if(alpha > 180) {
                    center = 1;
                } else {
                    center = 0;
                }
                path = "M"+ 70+","+ (70 - R) +" A"+ R+","+ R+","+ 0+"," + center +","+ 1+","+ x+","+ y;
            }

            return path;
        }

        
        function calcPath2 (value, total, R) {
            var center;
            var alpha = 180 / total * value,
                    a = (90 - alpha) * Math.PI / 180,
                     x = 70 + R * Math.cos(a),
                    y = 70 - R * Math.sin(a),
                    path;
            if (total == value) {
                path = "M"+ 70 +","+ (70 - R) +" A"+ R+","+ R+","+ 0+","+ 1+","+ 1+","+ 69.99+","+ 70 - R;
            } else {
                if(alpha > 180) {
                    center = 1;
                } else {
                    center = 0;
                }
                path = "M"+ 70+","+ (70 - R) +" A"+ R+","+ R+","+ 0+"," + center +","+ 1+","+ x+","+ y;
            }

            return path;
        
        }

        function updatePath(progress_id,  value, total, color){
            if(value<total){
                path = calcPath(value, total, 60);
            }else{
                path = calcPath(total-0.1, total, 60);
            }
            $('#'+progress_id+'_progress').html('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><path d="M70,20 A60,60,0,1,1,66.86047402353434,20.098663578586425"   fill="none" stroke="#DFDFDF" stroke-width="10" /> <path d="'+path+'"   fill="none" stroke="'+color+'" stroke-linejoin="round"   stroke-width="10" stroke-dasharray="10,2"/> </svg>');
            $('#'+progress_id+'_actual').html(value);

        }
        
        function updatePath2(progress_id,  value, total, color){
            if(value<total){
                path = calcPath2(value, total, 60);
            }else{
                path = calcPath2(total-0.1, total, 60);
            }
            $('#'+progress_id+'_progress').html('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><path d="M70,10 A60,60,0,1,1,67,10"   fill="none" stroke="#DFDFDF" stroke-width="10" /> <path d="'+path+'"   fill="none" stroke="'+color+'" stroke-linejoin="round"   stroke-width="10" stroke-dasharray="10,2"/> </svg>');
            $('#'+progress_id+'_actual').html(value);

        }
        
jQuery(document).ready(function() {
            var distance_value=0;
            var distance_actual = 32;
            var distance_intvar = setInterval(distanceUpdate, 10);

            function distanceUpdate(){
                distance_value = distance_value +1;
                updatePath('distance', Number(distance_value).toFixed(2), 50, '#007DC0');
                if(distance_value>distance_actual){
                    clearInterval(distance_intvar);
                    updatePath('distance', distance_actual, 50, '#007DC0');
                }
            }
            
            var my_value=0;
            var my_actual = 100;
            var my_intvar = setInterval(myUpdate, 20);

            function myUpdate(){
                my_value = my_value +1;
                updatePath2('my', Number(my_value).toFixed(2), 100, '#FF7DC0');
                if(my_value>my_actual){
                    clearInterval(my_intvar);
                    updatePath2('my', my_actual, 100, '#007DC0');
                }
            }            
    });