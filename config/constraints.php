<?php

if (env('APP_ENV') == 'production') {
} else {
    return [
        "development_mail_id" => strtolower('mannasoumya009@gmail.com'),
    ];
}
