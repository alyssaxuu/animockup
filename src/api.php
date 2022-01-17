<?php
    $request = $_POST["request"];
    
    if ($request == "check-subscription") {
        $id = $_POST["id"];
        $ch = curl_init("https://vendors.paddle.com/api/2.0/subscription/users?vendor_id=VENDOR_ID&vendor_auth_code=AUTH_CODE&subscription_id=".$id); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $data = curl_exec($ch);
        curl_close($ch);
        echo json_decode($data)->response[0]->state;
    } else if ($request == "get-subscription") {
        $output = array();
        $id = $_POST["id"];
        $ch = curl_init("https://vendors.paddle.com/api/2.0/subscription/users?vendor_id=137741&vendor_auth_code=AUTH_CODE&subscription_id=".$id); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $data = curl_exec($ch);
        curl_close($ch);
        array_push($output, json_decode($data)->response[0]->update_url);
        array_push($output, json_decode($data)->response[0]->cancel_url);
        echo json_encode($output);
    }
?>