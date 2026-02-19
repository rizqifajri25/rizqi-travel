export function formatIDR(number) {
    return new Intl.NumberFormat("id-ID").format(number);
}