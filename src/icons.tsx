import React from 'react'

const icons: Record<
  string,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
> = {
  Delete: (props) => (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.33342 4.99996H11.6667C11.6667 4.55793 11.4912 4.13401 11.1786 3.82145C10.866 3.50889 10.4421 3.33329 10.0001 3.33329C9.55805 3.33329 9.13413 3.50889 8.82157 3.82145C8.50901 4.13401 8.33342 4.55793 8.33342 4.99996V4.99996ZM6.66675 4.99996C6.66675 4.1159 7.01794 3.26806 7.64306 2.64294C8.26818 2.01782 9.11603 1.66663 10.0001 1.66663C10.8841 1.66663 11.732 2.01782 12.3571 2.64294C12.9822 3.26806 13.3334 4.1159 13.3334 4.99996H17.5001C17.7211 4.99996 17.9331 5.08776 18.0893 5.24404C18.2456 5.40032 18.3334 5.61228 18.3334 5.83329C18.3334 6.05431 18.2456 6.26627 18.0893 6.42255C17.9331 6.57883 17.7211 6.66663 17.5001 6.66663H16.7651L16.0267 15.2833C15.9558 16.1153 15.5751 16.8904 14.96 17.4552C14.3449 18.02 13.5402 18.3334 12.7051 18.3333H7.29508C6.46001 18.3334 5.65531 18.02 5.04021 17.4552C4.4251 16.8904 4.0444 16.1153 3.97341 15.2833L3.23508 6.66663H2.50008C2.27907 6.66663 2.06711 6.57883 1.91083 6.42255C1.75455 6.26627 1.66675 6.05431 1.66675 5.83329C1.66675 5.61228 1.75455 5.40032 1.91083 5.24404C2.06711 5.08776 2.27907 4.99996 2.50008 4.99996H6.66675ZM12.5001 9.99996C12.5001 9.77895 12.4123 9.56698 12.256 9.4107C12.0997 9.25442 11.8878 9.16663 11.6667 9.16663C11.4457 9.16663 11.2338 9.25442 11.0775 9.4107C10.9212 9.56698 10.8334 9.77895 10.8334 9.99996V13.3333C10.8334 13.5543 10.9212 13.7663 11.0775 13.9225C11.2338 14.0788 11.4457 14.1666 11.6667 14.1666C11.8878 14.1666 12.0997 14.0788 12.256 13.9225C12.4123 13.7663 12.5001 13.5543 12.5001 13.3333V9.99996ZM8.33342 9.16663C8.55443 9.16663 8.76639 9.25442 8.92267 9.4107C9.07895 9.56698 9.16675 9.77895 9.16675 9.99996V13.3333C9.16675 13.5543 9.07895 13.7663 8.92267 13.9225C8.76639 14.0788 8.55443 14.1666 8.33342 14.1666C8.1124 14.1666 7.90044 14.0788 7.74416 13.9225C7.58788 13.7663 7.50008 13.5543 7.50008 13.3333V9.99996C7.50008 9.77895 7.58788 9.56698 7.74416 9.4107C7.90044 9.25442 8.1124 9.16663 8.33342 9.16663V9.16663ZM5.63342 15.1416C5.66892 15.5578 5.85939 15.9455 6.16712 16.2279C6.47485 16.5103 6.8774 16.6669 7.29508 16.6666H12.7051C13.1225 16.6665 13.5246 16.5097 13.832 16.2273C14.1394 15.9449 14.3296 15.5575 14.3651 15.1416L15.0917 6.66663H4.90841L5.63508 15.1416H5.63342Z"
        fill="currentColor"
      />
    </svg>
  ),
}

export default icons