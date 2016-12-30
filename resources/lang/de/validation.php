<?php

return [
    'accepted' => ':attribute muss akzeptiert werden.',
    'active_url' => ':attribute ist keine gültige URL.',
    'after' => ':attribute muss ein Datum in diesem Format sein: :date',
    'alpha' => ':attribute darf nur Buchstaben enthalten.',
    'alpha_dash' => ':attribute darf nur Buchstaben, Ziffern und Bindestriche enthalten.',
    'alpha_num' => ':attribute darf nur Zahlen und Buchstaben enthalten.',
    'array' => ':attribute muss ein Array sein.',
    'before' => ':attribute muss ein Datum in diesem Format sein: :date',
    'between' => [
        'array' => ':attribute muss aus :min bis :max Elemente bestehen.',
        'file' => ':attribute muss zwischen :min und :max Kilobyte liegen.',
        'numeric' => ':attribute muss zwischen :min und :max liegen.',
        'string' => ':attribute muss aus :min bis :max Zeichen bestehen.',
    ],
    'boolean' => ':attribute muss wahr oder falsch sein.',
    'confirmed' => ':attribute wiederholung stimmt nicht überein.',
    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],
    'date' => ':attribute ist kein gültiges Datum.',
    'date_format' => ':attribute entspricht nicht dem Format: :format',
    'different' => ':attribute und :other muss verschieden sein.',
    'digits' => ':attribute muss aus :digits Ziffern bestehen.',
    'digits_between' => ':attribute muss aus :min bis :max Ziffern bestehen.',
    'exists' => 'das ausgewählte Attribut :attribute ist ungültig.',
    'filled' => ':attribute ist erforderlich.',
    'image' => ':attribute muss ein Bild sein.',
    'in' => 'Das ausgewählte Attribut :attribute ist ungültig.',
    'integer' => ':attribute muss eine Zahl sein.',
    'ip' => ':attribute muss eine gültige IP Adresse sein.',
    'json' => ':attribute muss ein gültiger JSON String sein.',
    'max' => [
        'array' => ':attribute darf nicht aus mehr als :max Elementen bestehen.',
        'file' => ':attribute darf nicht größer als :max Kilobytes sein.',
        'numeric' => ':attribute darf nicht größer als :max sein.',
        'string' => ':attribute darf nicht mehr als :max Zeichen lang sein.',
    ],
    'mimes' => ':attribute muss eine Datei des Typs :values sein.',
    'min' => [
        'array' => ':attribute muss aus mindestens :min Elementen bestehen.',
        'file' => ':attribute muss mindestens :min Kilobytes sein.',
        'numeric' => ':attribute muss mindestens :min sein.',
        'string' => ':attribute muss mindestens :min Zeichen lang sein.',
    ],
    'not_in' => 'Das ausgewählte Attribut :attribute ist ungültig.',
    'numeric' => ':attribute muss eine Zahl sein.',
    'regex' => ':attribute Format ungültig.',
    'required' => ':attribute ist erforderlich.',
    'required_if' => ':attribute ist erforderlich wenn :other gleich :value ist.',
    'required_with' => ':attribute ist erforderlich wenn eines von :values gesetzt ist.',
    'required_without' => ':attribute ist erforderlich wenn :values nicht gesetzt ist.',
    'required_without_all' => ':attribute ist erforderlich wenn keines von :values gesetzt ist.',
    'required_with_all' => ':attribute ist erforderlich wenn :values gesetzt ist.',
    'same' => ':attribute und :other müssen übereinstimmen.',
    'size' => [
        'array' => ':attribute muss mindestens :size Elemente enthalten.',
        'file' => ':attribute muss :size Kilobytes groß sein.',
        'numeric' => ':attribute muss :size groß sein.',
        'string' => ':attribute muss :size Zeichen lang sein.',
    ],
    'string' => ':attribute muss eine Zeichenkette sein.',
    'timezone' => ':attribute muss eine gültige Zeitzone sein.',
    'totp' => 'totp Token ist ungültig. Ist es abgelaufen?',
    'unique' => ':attribute wurde bereits verwendet.',
    'url' => ':attribute Format ungültig.',
];
