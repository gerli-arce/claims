<?php

namespace App\gLibraries;

class gTrace
{
    static private $mounths = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    static public function getId(): string
    {
        date_default_timezone_set('America/Lima');
        return date('YmdHisu');
    }
    static public function getDate(string $format = 'iso'): string
    {
        date_default_timezone_set('America/Lima');

        setlocale(LC_ALL, "es_ES");

        switch ($format) {
            case 'mysql':
                return date('Y-m-d H:i:s');
                break;
            case 'iso':
                return date('Y-m-d\TH:i:s\Z');
                break;
            case 'long':
                return date('j') . ' de ' . gTrace::$mounths[date('n') - 1] . ' del ' . date('Y');
                break;
            default:
                return date('Y-m-d H:i:s.u');
                break;
        }
    }
    static public function format(string $format): string
    {
        return date($format);
    }
    static public function month(string $index = ''): string
    {
        if ($index != '') {
            return gTrace::$mounths[intval($index)];
        }
        return gTrace::$mounths[date('n') - 1];
    }
}
